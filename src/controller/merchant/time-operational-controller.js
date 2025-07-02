import timeOperationalService from '../../service/merchant/time-operational-service.js'

const getTime = async (req, res, next) => {
	try{
		const result = await timeOperationalService.getTime(req.merchant.id)

		res.status(200).json({
			data: result
		})
	}catch(e){
		next(e)
	}
}

const addTime = async (req, res, next) => {
	try{
		const result = await timeOperationalService.addTime(req.merchant.id, req.body)

		res.status(200).json({
			message: 'Jam buka telah ditambahkan'
		})
	}catch(e){
		next(e)
	}
}

const updateTime = async (req, res, next) => {
	try{
		const result = await timeOperationalService.updateTime(req.params.id, req.merchant.id, req.body)

		res.status(200).json({
			message: 'Jam buka telah diperbarui'
		})
	}catch(e){
		next(e)
	}
}

const updateAllTime = async (req, res, next) => {
	try{
		const result = await timeOperationalService.updateAllTime(req.merchant.id, req.body)

		res.status(200).json({
			message: 'Semua jam operasional telah diperbarui'
		})
	}catch(e){
		next(e)
	}
}

const deleteTime = async (req, res, next) => {
	try{
		const result = await timeOperationalService.deleteTime(req.params.id, req.merchant.id)

		res.status(200).json({
			message: 'Jam buka berhasil dihapus'
		})
	}catch(e){
		next(e)
	}
}

const changeMode = async (req, res, next) => {
	try{
		const result = await timeOperationalService.changeMode(req.merchant.id, req.params.mode)

		res.status(200).json({
			message: 'Mode telah diperbarui'
		})
	}catch(e){
		next(e)
	}
}

const autoUpdate = async (req, res, next) => {
	try{
		const result = await timeOperationalService.autoUpdate()

		res.status(200).json({
			// message: 'Mode telah diperbarui'
			data: result
		})
	}catch(e){
		next(e)
	}
}

export default {
	getTime,
	addTime,
	updateTime,
	updateAllTime,
	deleteTime,
	changeMode,
	autoUpdate
}