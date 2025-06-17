import categoryService from '../../service/data-center/category-service.js'

const get = async (req, res, next) => {
	try{
		const result = await categoryService.get()

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