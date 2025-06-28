import menuService from '../../service/public/menu-service.js'

const getCurrentMerchant = async (req, res, next) => {
	try{
		const result = await menuService.getCurrentMerchant(req.params.id_merchant)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const getTime = async (req, res, next) => {
	try{
		const result = await menuService.getTime(req.params.id_merchant)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const getMenuByMerchant = async (req, res, next) => {
	try{
		const result = await menuService.getMenuByMerchant(req.params.id_merchant, req.query)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

export default {
	getCurrentMerchant,
	getMenuByMerchant,
	getTime
}