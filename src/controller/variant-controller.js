import variantService from '../service/variant-service.js'

const create = async (req, res, next) => {
	try{
		const result = await variantService.create(req.params.id_menu, req.merchant.id, req.body)
		res.status(200).json({
			message: 'Tambah varian sukses'
		})
	}catch(e){
		next(e)
	}
}

export default {
	create
}