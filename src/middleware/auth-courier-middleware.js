import {prismaClient} from '../application/database.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authCourierMiddleware = async (req, res, next) => {
	const token = req.get('Authorization')?.split(' ')[1]

	if(!token){
		return res.status(401).json({
			errors: 'Unauthorized'
		}).end()
	}

	try{
		const decoded = jwt.verify(token, process.env.JWT_SECRET_COURIER)
		const id = decoded.id

		if(id){
			const courier = await prismaClient.courier.findUnique({
				where: {
					id: id
				}
			})

			if(!courier){
				return res.status(401).json({
					errors: 'Token invalid or expired'
				}).end()
			}else{
				req.courier = courier
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