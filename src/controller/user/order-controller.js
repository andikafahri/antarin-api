import orderService from '../../service/user/order-service.js'

const create = async (req, res, next) => {
	const ref = {
		id_user: req.user.id,
		id_merchant: req.params.id_merchant
	}

	try{
		const result = await orderService.create(ref, req.body)
		res.status(200).json({
			message: 'Order sukses'
		})
	}catch(e){
		next(e)
	}
}

const cancel = async (req, res, next) => {
	try{
		const result = await orderService.cancel(req.user.id, req.params.id_order)
		res.status(200).json({
			message: 'Order berhasil dibatalkan'
		})
	}catch(e){
		next(e)
	}
}

const get = async (req, res, next) => {
	try{
		const result = await orderService.get(req.user.id)
		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const getUnavailable = async (req, res, next) => {
	try{
		const result = await orderService.getUnavailable(req.user.id)
		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const confirm = async (req, res, next) => {
	try{
		const result = await orderService.confirm(req.user.id, req.body)
		res.status(200).json({
			message: 'Berhasil konfirmsasi'
		})
	}catch(e){
		next(e)
	}
}

export default {
	create,
	cancel,
	get,
	getUnavailable,
	confirm
}