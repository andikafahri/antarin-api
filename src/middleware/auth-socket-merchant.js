import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {ErrorResponse} from '../application/error-response.js'
import {orderSubscribeMerchant} from '../socket/merchant/order-subscribe-merchant.js'

const authSocketMerchant = (io) => {
	io.use((socket, next) => {
		const token = socket.handshake.query.token

		if(!token){
			console.log('Socket User Unauthorized')
			return next(new ErrorResponse(401, 'Socket User Unauthorized'))
		}

		try{
			const decoded = jwt.verify(token, process.env.JWT_SECRET_MERCHANT)
			socket.merchant = decoded
			console.log('TOKEN MERCHANT: '+token)
			console.log(socket.merchant)
			next()
		}catch(error){
			console.log('TOKEN MERCHANT: '+token)
			console.log(socket.merchant)
			console.log('ERROR: '+error)
			next(new ErrorResponse(401, 'Socket User Invalid'))
		}
	})

	io.on('connection', (socket) => {
		console.log('Client (Merchant) connected');
		orderSubscribeMerchant(socket)
	})
}

export {authSocketMerchant}