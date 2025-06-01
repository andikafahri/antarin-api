import {prismaClient} from '../application/database.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authMerchantMiddleware = async (req, res, next) => {
	const token = req.get('Authorization')?.split(' ')[1]

	if(!token){
		return res.status(401).json({
			errors: 'Unauthorized'
		}).end()
	}

	try{
		const decoded = jwt.verify(token, process.env.JWT_SECRET_MERCHANT)
		const id = decoded.id

		if(id){
			const merchant = await prismaClient.merchant.findUnique({
				where: {
					id: id
				}
			})

			if(!merchant){
				return res.status(401).json({
					errors: 'Token invalid or expired'
				}).end()
			}else{
				req.merchant = merchant
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