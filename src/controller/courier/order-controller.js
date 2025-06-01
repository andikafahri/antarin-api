import orderService from '../../service/courier/order-service.js'

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

		res.status(200).json({
			message: 'Mohon antar pesanan ke alamat tujuan'
		})
	}catch(e){
		next(e)
	}
}

const finish = async (req, res, next) => {
	const id_courier = req.courier.id

	try{
		const result = await orderService.finish(id_courier)

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
	finish
}