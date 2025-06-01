import userService from '../../service/user/user-service.js'

const register = async (req, res, next) => {
	try{
		const result = await userService.register(req.body)

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
		const result = await userService.login(req.body)

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
		const result = await userService.get(req.user.id)

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
		const result = await userService.update(req.user.id, req.body)

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
		const result = await userService.updatePassword(req.user.id, req.body)

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