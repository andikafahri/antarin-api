import {validate} from '../validation/validation.js'
import {registerCourierValidation, loginCourierValidation, getCourierValidation, updateCourierValidation, updatePasswordValidation} from '../validation/courier-validation.js'
import {prismaClient} from '../application/database.js'
import {ErrorResponse} from '../application/error-response.js'
import uniqid from 'uniqid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const register = async (request) => {
	const data = validate(registerCourierValidation, request)

	const {confirm_password, ...req} = data

	const countCourier = await prismaClient.courier.count({
		where: {
			username: req.username
		}
	})

	if(countCourier === 1){
		throw new ErrorResponse(400, 'Username sudah digunakan')
	}

	req.id = uniqid()
	req.password = await bcrypt.hash(req.password, 10)
	req.is_active = false
	req.id_status = 1

	return prismaClient.courier.create({
		data: req,
		select: {
			username: true
		}
	})
}

const login = async (request) => {
	const req = validate(loginCourierValidation, request)

	const findCourier = await prismaClient.courier.findUnique({
		where: {
			username: req.username
		},
		select: {
			id: true,
			password: true
		}
	})

	if(!findCourier){
		throw new ErrorResponse(401, 'Username atau password salah')
	}

	const passwordIsValid = await bcrypt.compare(req.password, findCourier.password)

	if(!passwordIsValid){
		throw new ErrorResponse(401, 'Username atau password salah')
	}

	const payload = {
		id: findCourier.id
	}

	const token = jwt.sign(payload, process.env.JWT_SECRET_COURIER, {
		expiresIn: '180m'
	})

	return token
}

const get = async (id) => {
	id = validate(getCourierValidation, id)

	const data = await prismaClient.courier.findUnique({
		where: {
			id: id
		},
		select: {
			name: true,
			username: true,
			email: true,
			phone: true,
			number_plate: true,
			rel_brand: {
				select: {
					name: true
				}
			},
			color: true,
			rel_status: {
				select: {
					name: true
				}
			}
		}
	})

	if(!data){
		throw new ErrorResponse(404, 'User not found')
	}

	const courier = {
		...data,
		brand: data.rel_brand.name,
		status: data.rel_status.name
	}

	delete courier.rel_brand
	delete courier.rel_status

	return courier
}

const update = async (id, request) => {
	const req = validate(updateCourierValidation, request)

	const data = {}

	data.update_at = new Date()

	if(req.username){
		data.username = req.username
	}

	if(req.name){
		data.name = req.name
	}

	if(req.username){
		data.username = req.username
	}

	if(req.email){
		data.email = req.email
	}

	if(req.phone){
		data.phone = req.phone
	}

	if(req.number_plate){
		data.number_plate = req.number_plate
	}

	if(req.id_brand){
		data.id_brand = req.id_brand
	}

	if(req.color){
		data.color = req.color
	}

	return prismaClient.courier.update({
		where: {
			id: id
		},
		data: data,
		select: {
			username: true
		}
	})
}

const updatePassword = async (id, request) => {
	const req = validate(updatePasswordValidation, request)

	const findCourier = await prismaClient.courier.findUnique({
		where: {
			id: id
		},
		select: {
			password: true
		}
	})

	const passwordIsValid = await bcrypt.compare(req.password_old, findCourier.password)

	if(!passwordIsValid){
		throw new ErrorResponse(401, 'Password lama salah')
	}

	return prismaClient.courier.update({
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

export default {register, login, get, update, updatePassword}