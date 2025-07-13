import multer from 'multer'
import cloudinary from '../middleware/cloudinary.js'
import path from 'path'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs'
import {promises as fsPromises} from 'fs'
import {validate} from '../validation/validation.js'
import {
	registerMerchantValidation,
	loginMerchantValidation,
	getMerchantValidation,
	updateMerchantValidation,
	updatePasswordValidation
} from '../validation/merchant-validation.js'
import {prismaClient} from '../application/database.js'
import {ErrorResponse} from '../application/error-response.js'
import {getAddressWithCoordinate} from '../application/geo-json.js'
import uniqid from 'uniqid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const uploadImage = async (id_merchant, file) => {
	console.log('Uploading file at:', file.path, 'Size:', file.size, 'Type:', file.mimetype)

	if(!file){
		throw new ErrorResponse(400, 'Gambar tidak boleh kosong')
	}

	const filePath = file.path
	// try{
	// 	await fs.access(filePath)
	// }catch(error){
	// 	throw new ErrorResponse(500, 'File belum tersedia untuk diupload')
	// }

	try{

		const result = await cloudinary.uploader.upload(filePath, {
			folder: 'merchant/'+id_merchant,
			// folder: path.join('merchant/', id_merchant),
			// public_id: Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname),
			public_id: Date.now() + '-' + Math.round(Math.random() * 1E9),
			resource_type: 'image'
		})

		fs.unlinkSync(filePath)

		return result.secure_url
	}catch(error){
		console.log(error)
		if(fs.existsSync(filePath)){
			fs.unlinkSync(filePath)
		}
		throw new ErrorResponse(500, error.error.message || 'Upload image failed')
	}
}

const deleteImage = async (imageUrl) => {
	try{
		if(imageUrl && imageUrl.startsWith('https://res.cloudinary.com/')){
			const urlObj = new URL(imageUrl)
			const pathUrl = urlObj.pathname
			const parts = pathUrl.split('/')
			const fileName = parts.pop().split('.')[0]
			const folder = parts.slice(5).join('/')
			const file = `${folder}/${fileName}`
			console.log('FILE: '+file)
			
			const result = await cloudinary.uploader.destroy(file, {
				resource_type: 'image'
			})

			console.log(result)
			return result
		}
	}catch(error){
		console.log(error)
		throw new ErrorResponse(500, error.error.message || 'Delete image failed')
	}
}

const deleteImageOLD = async (id_merchant, filename) => {
	const __filename = fileURLToPath(import.meta.url)
	const __dirname = dirname(__filename)
	const imagePath = path.join(__dirname, '../../public/uploads/images/merchant', id_merchant, filename)

	if(fs.existsSync(imagePath)){
		await fsPromises.unlink(imagePath)
	}
}

// const register = async (file, id, request) => {
const register = async (file, request) => {
	const data = validate(registerMerchantValidation, request)

	const {confirm_password, coordinates, ...req} = data
	req.lng = coordinates.lng
	req.lat = coordinates.lat

	const addressData = await getAddressWithCoordinate(data.coordinates)
	req.id_subd = addressData.id_subd
	req.id_city = addressData.id_city
	req.id_prov = addressData.id_prov

	if(!file){
		throw new ErrorResponse(400, 'Gambar tidak boleh kosong')
	}
	// req.image = file

	const id = uniqid()
	const imageUrl = await uploadImage(id, file)
	req.image = imageUrl

	const countMerchant = await prismaClient.merchant.count({
		where: {
			username: req.username
		}
	})

	if(countMerchant === 1){
		throw new ErrorResponse(400, 'Username sudah digunakan')
	}

	req.id = id
	req.password = await bcrypt.hash(req.password, 10)
	req.is_open = false
	req.id_status = 1

	return prismaClient.merchant.create({
		data: req,
		select: {
			username: true
		}
	})
}

const login = async (request) => {
	const req = validate(loginMerchantValidation, request)

	const findMerchant = await prismaClient.merchant.findUnique({
		where: {
			username: req.username
		},
		select: {
			id: true,
			password: true
		}
	})

	if(!findMerchant){
		throw new ErrorResponse(401, 'Username atau password salah')
	}

	const passwordIsValid = await bcrypt.compare(req.password, findMerchant.password)

	if(!passwordIsValid){
		throw new ErrorResponse(401, 'Username atau password salah')
	}

	const payload = {
		id: findMerchant.id,
		role: 'merchant'
	}

	const token = jwt.sign(payload, process.env.JWT_SECRET_MERCHANT, {
		expiresIn: '180m'
	})

	return token
}

const get = async (id) => {
	id = validate(getMerchantValidation, id)

	const data = await prismaClient.merchant.findUnique({
		where: {
			id: id
		},
		select: {
			username: true,
			name: true,
			address: true,
			lng: true,
			lat: true,
			image: true,
			rel_subd: {
				select: {
					id: true,
					name: true
				}
			},
			rel_city: {
				select: {
					id: true,
					name: true
				}
			},
			rel_prov: {
				select: {
					id: true,
					name: true
				}
			},
			email: true,
			phone: true,
			rel_status: {
				select: {
					id: true,
					name: true
				}
			}
		}
	})

	if(!data){
		throw new ErrorResponse(404, 'Merchant not found')
	}

	const merchant = {
		...data,
		coordinates: {
			lng: data.lng,
			lat: data.lat
		},
		subd: data.rel_subd,
		city: data.rel_city,
		prov: data.rel_prov,
		status: data.rel_status
	}

	delete merchant.lng
	delete merchant.lat
	delete merchant.rel_subd
	delete merchant.rel_city
	delete merchant.rel_prov
	delete merchant.rel_status

	return merchant
}

const update = async (id, file, request) => {
	console.log(request)
	const req = validate(updateMerchantValidation, request)
	console.log(req)

	const addressData = await getAddressWithCoordinate(req.coordinates)

	const data = {}

	const imageUrl = await uploadImage(id, file)
	data.update_at = new Date()

	if(req.username){
		data.username = req.username
	}

	if(req.name){
		data.name = req.name
	}

	if(req.address){
		data.address = req.address
	}

	// if(req.id_subd){
	// 	data.id_subd = req.id_subd
	// }

	// if(req.id_city){
	// 	data.id_city = req.id_city
	// }

	// if(req.id_prov){
	// 	data.id_prov = req.id_prov
	// }

	if(req.coordinates.lng){
		data.lng = req.coordinates.lng
	}

	if(req.coordinates.lat){
		data.lat = req.coordinates.lat
	}

	if(req.email){
		data.email = req.email
	}

	if(req.phone || req.phone === ''){
		data.phone = req.phone
	}

	if(file){
		data.image = imageUrl
	}

	data.id_subd = addressData.id_subd
	data.id_city = addressData.id_city
	data.id_prov = addressData.id_prov

	// Mengecek apakah properti phone benar-benar ada di dalam objek req, meskipun nilainya undefined atau kosong string ('')
	// if('phone' in req){
	// 	console.log('PHONE: '+req.phone)
	// 	if(req.phone === ''){
	// 		data.phone = null
	// 	}else{
	// 		data.phone = req.phone
	// 	}
	// }

	const oldData = await prismaClient.merchant.findUnique({
		where: {
			id: id
		},
		select: {
			image: true
		}
	})

	const result = await prismaClient.merchant.update({
		where: {
			id: id
		},
		data: data,
		select: {
			username: true
		}
	})

	if(file){
		await deleteImage(oldData.image)
	}

	return result
}

const updatePassword = async (id, request) => {
	const req = validate(updatePasswordValidation, request)

	const findMerchant = await prismaClient.merchant.findUnique({
		where: {
			id: id
		},
		select: {
			password: true
		}
	})

	const passwordIsValid = await bcrypt.compare(req.password_old, findMerchant.password)

	if(!passwordIsValid){
		throw new ErrorResponse(401, 'Password lama salah')
	}

	return prismaClient.merchant.update({
		where: {
			id: id
		},
		data: {
			password: await bcrypt.hash(req.password_new, 10),
			update_at: new Date()
		},
		select: {
			username: true
		}
	})
}

export default {
	register,
	login,
	get,
	update,
	updatePassword
}