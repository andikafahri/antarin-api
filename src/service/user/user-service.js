import {validate} from '../../validation/validation.js'
import {registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation, updatePasswordValidation} from '../../validation/user/user-validation.js'
import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'
import uniqid from 'uniqid'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const register = async (request) => {
	const data = validate(registerUserValidation, request)

	const {confirm_password, ...req} = data

	const countUser = await prismaClient.user.count({
		where: {
			username: req.username
		}
	})

	if(countUser === 1){
		throw new ErrorResponse(400, 'Username sudah digunakan')
	}

	req.id = uniqid()
	req.password = await bcrypt.hash(req.password, 10)
	req.poin = 0
	req.id_status = 1

	return prismaClient.user.create({
		data: req,
		select: {
			username: true
		}
	})
}

const login = async (request) => {
	const req = validate(loginUserValidation, request)

	const findUser = await prismaClient.user.findUnique({
		where: {
			username: req.username
		},
		select: {
			id: true,
			password: true
		}
	})

	if(!findUser){
		throw new ErrorResponse(401, 'Username atau password salah')
	}

	const passwordIsValid = await bcrypt.compare(req.password, findUser.password)

	if(!passwordIsValid){
		throw new ErrorResponse(401, 'Username atau password salah')
	}

	const payload = {
		id: findUser.id,
		role: 'user'
	}

	const secretKey = process.env.JWT_SECRET_USER

	const token = jwt.sign(payload, secretKey, {
		expiresIn: '180m'
	})

	return token
}

const get = async (id) => {
	id = validate(getUserValidation, id)

	const data = await prismaClient.user.findUnique({
		where: {
			id: id
		},
		select: {
			name: true,
			username: true,
			email: true,
			phone: true,
			poin: true,
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

	const user = {
		...data,
		status: data.rel_status.name
	}

	delete user.rel_status

	return user
}

const update = async(id, request) => {
	const req = validate(updateUserValidation, request)

	

	const findUser = await prismaClient.user.count({
		where: {
			username: request.username,
			id: {
				not: id
			}
		}
	})

	if(findUser === 1){
		throw new ErrorResponse(400, 'Username sudah digunakan')
	}

	const data = {}

	data.update_at = new Date()

	if(req.username){
		data.username = req.username
	}

	if(req.name){
		data.name = req.name
	}

	if(req.email){
		data.email = req.email
	}

	if(req.phone){
		data.phone = req.phone
	}

	return prismaClient.user.update({
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

	const findUser = await prismaClient.user.findUnique({
		where: {
			id: id
		},
		select: {
			password: true
		}
	})

	const passwordIsValid = await bcrypt.compare(req.password_old, findUser.password)

	if(!passwordIsValid){
		throw new ErrorResponse(401, 'Password lama salah')
	}

	return prismaClient.user.update({
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