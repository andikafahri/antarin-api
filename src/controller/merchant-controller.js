import merchantService from '../service/merchant-service.js'

const register = async (req, res, next) => {
	try{
		const result = await merchantService.register(req.body)
		res.status(200).json({
			message: 'Register sukses'
		})
	}catch(e){
		next(e)
	}
}

const login = async (req, res, next) => {
	try{
		const result = await merchantService.login(req.body)
		res.status(200).json({
			token: result
		})
	}catch(e){
		next(e)
	}
}

const get = async (req, res, next) => {
	try{
		const result = await merchantService.get(req.merchant.id)
		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const update = async (req, res, next) => {
	try{
		const result = await merchantService.update(req.merchant.id, req.body)
		res.status(200).json({
			message: 'Edit sukses'
		})
	}catch(e){
		next(e)
	}
}

const updatePassword = async (req, res, next) => {
	try{
		const result = await merchantService.updatePassword(req.merchant.id, req.body)
		res.status(200).json({
			message: 'Ubah password sukses'
		})
	}catch(e){
		next(e)
	}
}

export default {
	register,
	login,
	get,
	update,
	updatePassword
}