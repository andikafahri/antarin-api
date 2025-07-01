import multer from 'multer'
import {ErrorResponse} from '../application/error-response.js'

const upload = multer({
	dest: 'tmp/',
	limits: {fileSize: 2 * 1024 * 1024},
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
		if(allowed.includes(file.mimetype)){
			cb(null, true)
		}else{
			return cb(new ErrorResponse(400, 'Tipe file harus berupa jpg, jpeg, png, atau webp'))
		}
	}
})

export {upload}