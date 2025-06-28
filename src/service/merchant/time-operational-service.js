import {validate} from '../../validation/validation.js'
import {addAndUpdateValidation} from '../../validation/merchant/time-operational-validation.js'
import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'

const findRow = async (id, id_merchant) => {
	if(!Number.isInteger(id)){
		return false
	}

	return prismaClient.time_operational.findFirst({
		where: {
			id: id,
			id_merchant: id_merchant
		}
	})
}

const getTime = async (id_merchant) => {
	const data = await prismaClient.time_operational.findMany({
		where: {
			id_merchant: id_merchant
		},
		select: {
			rel_merchant: {
				select: {
					is_open: true,
					is_open_mode: true
				}
			},
			id: true,
			day: true,
			start_time: true,
			end_time: true
		}
	})

	const result = {
		is_open: data[0].rel_merchant.is_open,
		is_open_mode: data[0].rel_merchant.is_open_mode,
		schedule: data.map(time => ({
			id: time.id,
			day: time.day,
			start_time: time.start_time,
			end_time: time.end_time
		}))
	}

	delete result.rel_merchant

	return result
}

const addTime = async (id_merchant, request) => {
	const req = validate(addAndUpdateValidation, request)

	const findDay = await prismaClient.time_operational.findFirst({
		where: {
			day: req.day,
			id_merchant: id_merchant
		}
	})

	if(findDay){
		throw new ErrorResponse(400, 'Kamu sudah mengatur jam operasional pada hari tersebut')
	}

	return prismaClient.time_operational.create({
		data: {
			id_merchant: id_merchant,
			day: req.day,
			start_time: req.start_time,
			end_time: req.end_time
		}
	})
}

const updateTime = async (id, id_merchant, request) => {
	id = parseInt(id)
	const req = validate(addAndUpdateValidation, request)

	const find = await findRow(id, id_merchant)
	if(!find){
		throw new ErrorResponse(404, 'Data tidak ditemukan')
	}

	return prismaClient.time_operational.update({
		where: {
			id: id,
			id_merchant: id_merchant
		},
		data: {
			day: req.day,
			start_time: req.start_time,
			end_time: req.end_time,
			update_at: new Date()
		}
	})
}

const deleteTime = async (id, id_merchant) => {
	id = parseInt(id)
	const find = await findRow(id, id_merchant)
	if(!find){
		throw new ErrorResponse(404, 'Data tidak ditemukan')
	}

	return prismaClient.time_operational.delete({
		where: {
			id: id,
			id_merchant: id_merchant
		}
	})
}

const changeMode = async (id_merchant, request) => {
	const allowedRequest = ['auto', 'open', 'close']
	// const isValidRequest = Object.values(request || {}).every(key => allowedRequest.includes(key))

	// if(!isValidRequest){
	if(!allowedRequest.includes(request)){
		throw new ErrorResponse(400, 'Request tidak valid')
	}

	const data = {}
	data.is_open_mode = request

	if(request === 'open'){
		data.is_open = true
	}

	if(request === 'close'){
		data.is_open = false
	}

	return prismaClient.merchant.update({
		where: {
			id: id_merchant
		},
		data: data
	})
}

const autoUpdate = async () => {
	const data = await prismaClient.time_operational.findMany({
		where: {
			day: new Date().getDay(),
			rel_merchant: {
				is_open_mode: 'auto'
			}
		}
	})

	const isOpen = []
	const isClose = []
	const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes()
	data.map(list => {
		const [startH, startM] = list.start_time.split(':').map(Number)
		const [endH, endM] = list.end_time.split(':').map(Number)
		const startMinutes = startH * 60 + startM
		const endMinutes = endH * 60 + endM
		console.log(startMinutes)
		console.log(endMinutes)

		if(startMinutes <= endMinutes){
			// return nowMinutes >= startMinutes && nowMinutes < endMinutes
			if(nowMinutes >= startMinutes && nowMinutes < endMinutes){
				isOpen.push(list.id_merchant)
			}else{
				isClose.push(list.id_merchant)
			}
		}else{
			// return nowMinutes >= startMinutes || nowMinutes < endMinutes
			if(nowMinutes >= startMinutes || nowMinutes < endMinutes){
				isOpen.push(list.id_merchant)
			}else{
				isClose.push(list.id_merchant)
			}
		}
	})

	const result = await prismaClient.$transaction(async tx => {
		const results = {set_to_open: 0, set_to_close: 0}
		// return Promise.all([
		results.set_to_open = await tx.merchant.updateMany({
			where: {
				id: {
					in: isOpen
				}
			},
			data: {
				is_open: true
			}
		})

		results.set_to_close = await tx.merchant.updateMany({
			where: {
				id: {
					in: isClose
				}
			},
			data: {
				is_open: false
			}
		})	
		// ])
		return results
	})

	return result
}

export default {
	getTime,
	addTime,
	updateTime,
	deleteTime,
	changeMode,
	autoUpdate
}