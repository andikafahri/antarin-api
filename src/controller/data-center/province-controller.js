import provinceService from '../../service/data-center/province-service.js'

const get = async (req, res, next) => {
	try{
		const result = await provinceService.get()

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