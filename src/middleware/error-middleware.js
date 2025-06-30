import multer from 'multer'
import {ErrorResponse} from '../application/error-response.js'

const errorMiddleware = async (err, req, res, next) => {
	if(!err){
		next()
		return
	}

	if(err instanceof ErrorResponse){
		res.status(err.status).json({
			errors : err.message
		}).end()
	}else{
		res.status(500).json({
			errors : err.message
		}).end()
	}

	// ERROR MULTER
	if(err instanceof multer.MulterError){
		if(err.code === 'LIMIT_FILE_SIZE'){
			res.status(413).json({
				errors: 'Ukuran gambar maksimal 2 MB'
			})
		}
		res.status(400).json({
			errors: err.message
		})
	}

	if(err.message === 'File not allowed'){
		res.status(400).json({
			errors: 'Tipe file tidak didukung'
		})
	}
}

export {errorMiddleware}