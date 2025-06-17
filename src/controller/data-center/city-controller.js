import cityService from '../../service/data-center/city-service.js'

const get = async (req, res, next) => {
	try{
		const result = await cityService.get(req.params.id_province)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

export default {
	get
}