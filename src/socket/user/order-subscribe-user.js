import {prismaClient} from '../../application/database.js'

const orderSubscribeUser = (socket) => {
	socket.on('subscribeOrderUser', async (idOrder) => {
		console.log(`User subscribed to ${idOrder}`);
		const idUser = socket.user.id

		try{
			const user = await prismaClient.user.findUnique({
				where: {
					id: idUser
				}
			})

			if(!user){
				return socket.emit('socketError', 'Token invalid or expired')
				console.log('User not found')
			}

			const order = await prismaClient.order.findFirst({
				where: {
					id: idOrder,
					id_user: idUser
				}
			})

			if(!order){
				return socket.emit('socketError', 'Order not found')
				console.log('Order not found')
			}

			socket.join(`orderUser:${idOrder}`)
			console.log('JOIN: '+idOrder)
		}catch(error){
			socket.emit('socketError', 'Server error')
		}
	})
}

export {orderSubscribeUser}