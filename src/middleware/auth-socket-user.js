import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {ErrorResponse} from '../application/error-response.js'
import {orderSubscribeUser} from '../socket/user/order-subscribe-user.js'

const authSocketUser = (io) => {
	io.use((socket, next) => {
		const token = socket.handshake.query.token

		if(!token){
			console.log('Socket User Unauthorized')
			return next(new ErrorResponse(401, 'Socket User Unauthorized'))
		}

		try{
			const decoded = jwt.verify(token, process.env.JWT_SECRET_USER)
			socket.user = decoded
			console.log('TOKEN USER: '+token)
			console.log(socket.user)
			next()
		}catch(error){
			console.log('TOKEN USER: '+token)
			console.log(socket.user)
			console.log('ERROR: '+error)
			next(new ErrorResponse(401, 'Socket User Invalid'))
		}
	})

	io.on('connection', (socket) => {
		console.log('Client (User) connected');
		orderSubscribeUser(socket)
	})
}

export {authSocketUser}