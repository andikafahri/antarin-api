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
import uniqid from 'uniqid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const deleteImage = async (id_merchant, filename) => {
	const __filename = fileURLToPath(import.meta.url)
	const __dirname = dirname(__filename)
	const imagePath = path.join(__dirname, '../../public/uploads/images/merchant', id_merchant, filename)

	if(fs.existsSync(imagePath)){
		await fsPromises.unlink(imagePath)
	}
}

const register = async (filename, id, request) => {
	const data = validate(registerMerchantValidation, request)

	const {confirm_password, ...req} = data

	if(!filename){
		throw new ErrorResponse(400, 'Gambar tidak boleh kosong')
	}
	req.image = filename

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
		subd: data.rel_subd,
		city: data.rel_city,
		prov: data.rel_prov,
		status: data.rel_status
	}

	delete merchant.rel_subd
	delete merchant.rel_city
	delete merchant.rel_prov
	delete merchant.rel_status

	return merchant
}

const update = async (id, filename, request) => {
	const req = validate(updateMerchantValidation, request)
	console.log(req)
	const data = {}

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

	if(req.id_subd){
		data.id_subd = req.id_subd
	}

	if(req.id_city){
		data.id_city = req.id_city
	}

	if(req.id_prov){
		data.id_prov = req.id_prov
	}

	if(req.email){
		data.email = req.email
	}

	if(req.phone || req.phone === ''){
		data.phone = req.phone
	}

	if(filename){
		data.image = filename
	}

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

	if(filename){
		await deleteImage(id, oldData.image)
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