import multer from 'multer'

const upload = multer({
	dest: 'tmp/',
	limits: {fileSize: 2 * 1024 * 1024},
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
		allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('File not allowed'))
	}
})

export {upload}