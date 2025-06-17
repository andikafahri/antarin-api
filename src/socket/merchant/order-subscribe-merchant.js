import {prismaClient} from '../../application/database.js'

const orderSubscribeMerchant = (socket) => {
	socket.on('subscribeOrderMerchant', async () => {
		console.log(`Merchant subscribed to ${socket.merchant.id}`);
		const idMerchant = socket.merchant.id

		try{
			const merchant = await prismaClient.merchant.findUnique({
				where: {
					id: idMerchant
				}
			})

			if(!merchant){
				return socket.emit('socketError', 'Token invalid or expired')
			}

			// const order = await prismaClient.order.findFirst({
			// 	where: {
			// 		id_merchant: idMerchant
			// 	}
			// })

			// if(!order){
			// 	return socket.emit('socketError', 'Order not found')
			// }

			socket.join(`orderMerchant:${idMerchant}`)
			console.log('MERCHANT JOIN: '+idMerchant)
		}catch(error){
			socket.emit('socketError', 'Server error')
		}
	})
}

export {orderSubscribeMerchant}