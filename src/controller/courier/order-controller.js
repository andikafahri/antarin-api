import orderService from '../../service/courier/order-service.js'
import {userSocket as ioUser} from '../../application/app.js'
import {merchantSocket as ioMerchant} from '../../application/app.js'

const get = async (req, res, next) => {
	const id_courier = req.courier.id

	try{
		const result = await orderService.get(id_courier)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const deliver = async (req, res, next) => {
	const id_courier = req.courier.id

	try{
		const result = await orderService.deliver(id_courier)

		setTimeout(() => {
			ioUser.to(`orderUser:${result.id_order}`).emit('updateStatusOrder', result)
			ioMerchant.to(`orderMerchant:${result.merchant.id}`).emit('updatePickUp', result)
		}, 3000)

		res.status(200).json({
			message: 'Mohon antar pesanan ke alamat tujuan'
		})
	}catch(e){
		next(e)
	}
}

const delivered = async (req, res, next) => {
	const id_courier = req.courier.id

	try{
		const result = await orderService.delivered(id_courier)

		setTimeout(() => {
			io.to(result.id_order).emit('updateStatusOrder', result)
		}, 3000)

		res.status(200).json({
			message: 'Kamu sudah sampai tujuan'
		})
	}catch(e){
		next(e)
	}
}

const finish = async (req, res, next) => {
	const id_courier = req.courier.id

	try{
		const result = await orderService.finish(id_courier)

		setTimeout(() => {
			io.to(result.id_order).emit('updateStatusOrder', result)
		}, 3000)

		res.status(200).json({
			message: 'Pesanan berhasil diselesaikan'
		})
	}catch(e){
		next(e)
	}
}

export default {
	get,
	deliver,
	delivered,
	finish
}