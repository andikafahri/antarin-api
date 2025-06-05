import orderService from '../../service/merchant/order-service.js'
import {logger} from '../../application/logger.js'
import {io} from '../../application/app.js'

const get = async (req, res, next) => {
	const filter = {
		id_merchant: req.merchant.id,
		id_status: req.query.status
	}

	try{
		const result = await orderService.get(filter)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const reject = async (req, res, next) => {
	const filter = {
		id_order: req.params.id_order,
		id_merchant: req.merchant.id
	}

	try{
		const result = await orderService.reject(filter, req.body)

		res.status(200).json({
			message: 'Pesanan berhasil ditolak'
		})
	}catch(e){
		next(e)
	}
}

const accept = async (req, res, next) => {
	const filter = {
		id_order: req.params.id_order,
		id_merchant: req.merchant.id
	}

	try{
		const result = await orderService.accept(filter, req.body)

		// Update otomatis
		setTimeout(() => {
		// Emit ke client via WebSocket
			const idOrder = req.params.id_order
			io.to(idOrder).emit('updateStatusOrder', {status: 2})
			console.log('Order '+idOrder+'updated to id status 2')
		}, 3000)

		res.status(200).json({
			message: 'Segera proses pesanan!'
		})
	}catch(e){
		next(e)
	}
}

const unavailable = async (req, res, next) => {
	const filter = {
		id_order: req.params.id_order,
		id_merchant: req.merchant.id
	}
	
	try{
		const result = await orderService.unavailable(filter, req.body)

		res.status(200).json({
			message: 'Menunggu konfirmasi dari pembeli'
		})
	}catch(e){
		next(e)
	}
}

const finish = async (req, res, next) => {
	const ref = {
		id_order: req.params.id_order.trim(),
		id_merchant: req.merchant.id
	}

	try{
		const result = await orderService.finish(ref)

		setTimeout(() => {
			const idOrder = req.params.id_order
			io.to(idOrder).emit('updateStatusOrder')
		}, 3000)

		res.status(200).json({
			message: 'Menunggu kurir mengambil pesanan'
		})
	}catch(e){
		next(e)
	}
}

export default {
	get,
	reject,
	accept,
	unavailable,
	finish
}