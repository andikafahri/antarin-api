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
	}else if(err instanceof multer.MulterError){
		// ERROR MULTER
		if(err.code === 'LIMIT_FILE_SIZE' || err.message === 'File too large'){
			res.status(413).json({
				errors: 'Ukuran gambar maksimal 2 MB'
			})
		}
		res.status(400).json({
			errors: err.message
		})
	}else{
		res.status(500).json({
			errors : err.message
		}).end()
	}

	// if(err.message === 'File not allowed'){
	// 	res.status(400).json({
	// 		errors: 'Tipe file tidak didukung'
	// 	})
	// }
}

export {errorMiddleware}