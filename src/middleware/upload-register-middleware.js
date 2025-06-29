import multer from 'multer'
import path from 'path'
import fs from 'fs'
import uniqid from 'uniqid'
import {ErrorResponse} from '../application/error-response.js'

const id = uniqid()
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const role = req.body.role
		console.log(role)

		if(role !== 'user' && role !== 'merchant' && role !== 'courier') {
			return cb(new ErrorResponse(404, 'Role not found'))
		}

		const safeRole = String(role).replace(/[^[a-zA-Z0-9_-]/g, '')
		// const safeId = String(id).replace(/[^[a-zA-Z0-9_-]/g, '')
		const folder = path.join('public/uploads/images/', role, id)

		fs.mkdir(folder, {recursive: true}, error => {
			if(error){
				return cb(error)
			}


			cb(null, folder)
		})
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1E9)
		const extension = path.extname(file.originalname)
		const finalName = unique + extension
		cb(null, finalName)

		req.filename = finalName
		req.id = id
	}
})

const upload = multer({storage})

export {upload}