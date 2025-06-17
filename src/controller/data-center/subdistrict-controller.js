import subdistrictService from '../../service/data-center/subdistrict-service.js'

const get = async (req, res, next) => {
	try{
		const result = await subdistrictService.get(req.params.id_city)

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