import menuService from '../service/menu-service.js'

// const create = async (req, res, next) => {
// 	try{
// 		const result = await menuService.create(req.merchant.id, req.body)
// 		res.status(200).json({
// 			message: 'Tambah menu sukses'
// 		})
// 	}catch(e){
// 		next(e)
// 	}
// }

const createwithVariant = async (req, res, next) => {
	// res.status(200).json({
	// 	data: {
	// 		body: req.body,
	// 		variants: req.body.variants ? JSON.parse(req.body.variants) : []
	// 	}
	// })

	// if(req.is('multipart/form-data')){
	// 	const data = JSON.parse(req.body.reduce((acc, [key, val]) => ({...acc, [key]: val}), {}))
	// 	const request = {...data, variants: data.variants ? JSON.parse(data.variants) : []}
	// }else{
	// 	const request = {...req.body, variants: req.body.variants ? JSON.parse(req.body.variants) : []}
	// }

	const request = {...req.body, variants: req.body.variants ? JSON.parse(req.body.variants) : []}

	try{
		const result = await menuService.createMenuwithVariant(req.merchant.id, req.filename, request)
		res.status(200).json({
			message: 'Tambah menu sukses'
			// result
		})
	}catch(e){
		next(e)
	}
}

const getList = async (req, res, next) => {
	try{
		const result = await menuService.getList(req.merchant.id, req.query)
		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

// const getCurrent = async (req, res, next) => {
// 	try{
// 		const result = await menuService.getCurrent(req.params.id, req.merchant.id)
// 		res.status(200).json({
// 			data: result
// 		})
// 	}catch(e){
// 		next(e)
// 	}
// }

const getCurrentWithVariant = async (req, res, next) => {
	try{
		const result = await menuService.getCurrentWithVariant(req.params.id, req.merchant.id)
		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

// const update = async (req, res, next) => {
// 	try{
// 		const result = await menuService.update(req.params.id, req.merchant.id, req.body)
// 		res.status(200).json({
// 			message: 'Edit sukses'
// 		})
// 	}catch(e){
// 		next(e)
// 	}
// }

const updateWithVariant = async (req, res, next) => {
	const request = {...req.body, variants: JSON.parse(req.body.variants || '[]')}

	try{
		const result = await menuService.updateWithVariant(req.params.id, req.merchant.id, req.filename, request)
		res.status(200).json({
			message: 'Edit sukses'
		})
	}catch(e){
		next(e)
	}
}

const remove = async (req, res, next) => {
	try{
		const result = await menuService.remove(req.params.id, req.merchant.id)

		res.status(200).json({
			message: 'Hapus sukses'
		})
	}catch(e){
		next(e)
	}
}

const getCategory = async (req, res, next) => {
	try{
		const result = await menuService.getCategory()
		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

export default {
	// create,
	createwithVariant,
	getList,
	// getCurrent,
	getCurrentWithVariant,
	// update,
	updateWithVariant,
	remove,
	getCategory
}