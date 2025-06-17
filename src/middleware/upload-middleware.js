import multer from 'multer'
import path from 'path'
import fs from 'fs'
import {ErrorResponse} from '../application/error-response.js'

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		let role = null
		let id = null

		if(req.user){
			role = 'user'
			id = req.user.id
		}else if(req.merchant){
			role = 'merchant'
			id = req.merchant.id
		}else if(req.courier){
			role = 'courier'
			id = req.courier.id
		}else{
			role = null
			id = null
		}

		if(!role || !id) {
			return cb(new ErrorResponse(404, 'User not found'))
		}

		const safeRole = String(role).replace(/[^[a-zA-Z0-9_-]/g, '')
		const safeId = String(id).replace(/[^[a-zA-Z0-9_-]/g, '')
		const folder = path.join('public/uploads/images/', safeRole, safeId)

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
	}
})

const upload = multer({storage})

export {upload}