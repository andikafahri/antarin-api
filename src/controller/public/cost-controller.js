import destinationService from '../../service/public/cost-service.js'

const getSystemCost = async (req, res, next) => {
	try {
		const result = await destinationService.getSystemCost(req.body.destination)

		res.status(200).json({
			data: result
		})
	}catch(e) {
		next(e)
	}
}

export default {
	getSystemCost
}