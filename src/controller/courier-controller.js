import courierService from '../service/courier-service.js'

const register = async (req, res, next) => {
	try{
		const result = await courierService.register(req.body)

		if(result){
			res.status(200).json({
				message: 'Register sukses'
			})
		}
	}catch(e){
		next(e)
	}
}

const login = async (req, res, next) => {
	try{
		const result = await courierService.login(req.body)

		if(result){
			res.status(200).json({
				token: result
			})
		}
	}catch(e){
		next(e)
	}
}

const get = async (req, res, next) => {
	try{
		const result = await courierService.get(req.courier.id)

		if(result){
			res.status(200).json({
				data: result
			})
		}
	}catch(e){
		next(e)
	}
}

const update = async (req, res, next) => {
	try{
		const result = await courierService.update(req.courier.id, req.body)

		if(result){
			res.status(200).json({
				message: 'Edit sukses'
			})
		}
	}catch(e){
		next(e)
	}
}

const updatePassword = async (req, res, next) => {
	try{
		const result = await courierService.updatePassword(req.courier.id, req.body)

		if(result){
			res.status(200).json({
				message: 'Ubah password sukses'
			})
		}
	}catch(e){
		next(e)
	}
}

export default {register, login, get, update, updatePassword}