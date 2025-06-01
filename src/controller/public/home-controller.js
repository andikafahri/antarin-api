import homeService from '../../service/public/home-service.js'

const getList = async (req, res, next) => {
	try{
		const result = await homeService.getList(req.query)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

export default {
	getList
}