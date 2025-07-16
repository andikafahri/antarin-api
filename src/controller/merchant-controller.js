import express from 'express'
import path from 'path'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs'
import merchantService from '../service/merchant-service.js'

const register = async (req, res, next) => {
	const {role, ...request} = req.body
	request.coordinates = JSON.parse(req.body.coordinates || '{}')

	try{
		// const result = await merchantService.register(req.filename, req.id, request)
		const result = await merchantService.register(req.file, request)
		res.status(200).json({
			message: 'Register sukses'
		})
	}catch(e){
		next(e)
	}
}

const login = async (req, res, next) => {
	try{
		const result = await merchantService.login(req.body)
		res.status(200).json({
			token: result
		})
	}catch(e){
		next(e)
	}
}

const get = async (req, res, next) => {
	try{
		const result = await merchantService.get(req.merchant.id)
		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const update = async (req, res, next) => {
	const {image, coordinates, ...request} = req.body
	request.coordinates = JSON.parse(req.body.coordinates || '{}')

	try{
		const result = await merchantService.update(req.merchant.id, req.file, request)
		res.status(200).json({
			message: 'Edit sukses'
		})
	}catch(e){
		next(e)
	}
}

const updatePassword = async (req, res, next) => {
	try{
		const result = await merchantService.updatePassword(req.merchant.id, req.body)
		res.status(200).json({
			message: 'Ubah password sukses'
		})
	}catch(e){
		next(e)
	}
}

// const getImage = async (req, res, next) => {
// 	const __filename = fileURLToPath(import.meta.url)
// 	const __dirname = dirname(__filename)

// 	const imagePath = path.join(__dirname, '../../public/uploads/images/merchant', req.merchant.id)

// 	if(!fs.existsSync(imagePath)){
// 		return res.status(404).json({
// 			message: 'Not Found'
// 		})
// 	}

// 	express.static(imagePath)(req, res, next)
// }

export default {
	register,
	login,
	get,
	update,
	updatePassword
	// getImage
}