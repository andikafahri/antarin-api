import {prismaClient} from '../application/database.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authUserMiddleware = async (req, res, next) => {
	const token = req.get('Authorization')?.split(' ')[1]

	if(!token){
		return res.status(401).json({
			errors: 'Unauthorized'
		}).end()
	}

	try{
		const decoded = jwt.verify(token, process.env.JWT_SECRET_USER)
		const id = decoded.id

		if(id){
			const user = await prismaClient.user.findUnique({
				where: {
					id: id
				}
			})

			if(!user){
				return res.status(401).json({
					errors: 'Token invalid or expired'
				}).end()
			}else{
				req.user = user
				next()
			}
		}else{
			return res.status(401).json({
				errors: 'Token invalid or expired'
			}).end()
		}
	}catch(err){
		return res.status(401).json({
			errors: 'Token invalid or expired'
		}).end()
	}
}