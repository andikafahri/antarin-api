import {validate} from '../../validation/validation.js'
import {
	getOrderValidation,
	decisionValidation,
	unavailableValidation
} from '../../validation/merchant/order-validation.js'
import {prismaClient} from '../../application/database.js'
import uniqid from 'uniqid'
import {logger} from '../../application/logger.js'
import {ErrorResponse} from '../../application/error-response.js'

const checkOrder = async (id_order, id_merchant, id_status) => {
	const result = await prismaClient.order.findFirst({
		where: {
			id: id_order,
			id_merchant: id_merchant,
			id_status: {
				// in: Array.isArray(id_status) ? id_status : [id_status]
				in: id_status
			}
		},
		select: {
			id: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Order tidak ditemukan')
	}
}

const getDataOrderForHistory = async (id_order, id_merchant) => {
	const data = await prismaClient.order.findFirst({
		where: {
			id: id_order,
			id_merchant: id_merchant
		},
		select: {
			id: true,
			destination: true,
			lng: true,
			lat: true,
			shipping_cost: true,
			service_cost: true,
			rel_user: {
				select: {
					id: true,
					name: true
				}
			},
			rel_merchant: {
				select: {
					id: true,
					name: true
				}
			},
			rel_courier: {
				select: {
					id: true,
					name: true
				}
			},
			rel_subd: {
				select: {
					id: true,
					name: true
				}
			},
			rel_city: {
				select: {
					id: true,
					name: true
				}
			},
			rel_prov: {
				select: {
					id: true,
					name: true
				}
			}
		}
	})

	const result = {
		...data,
		id_user: data.rel_user.id,
		name_user: data.rel_user.name,
		id_merchant: data.rel_merchant.id,
		name_merchant: data.rel_merchant.name,
		id_courier: data.rel_courier?.id,
		name_courier: data.rel_courier?.name,
		id_subd: data.rel_subd.id,
		name_subd: data.rel_subd.name,
		id_city: data.rel_city.id,
		name_city: data.rel_city.name,
		id_prov: data.rel_prov.id,
		name_prov: data.rel_prov.name
	}

	delete result.rel_user
	delete result.rel_merchant
	delete result.rel_courier
	delete result.rel_subd
	delete result.rel_city
	delete result.rel_prov

	return result
}

const getDataOrderItemForHistory = async (id_order) => {
	const data = await prismaClient.order_item.findMany({
		where: {
			id_order: id_order
		}
	})

	const {created_at, update_at, ...result} = data

	return result
}

const checkItem = async (id_item, id_order) => {
	const result = await prismaClient.order_item.findFirst({
		where: {
			id: id_item,
			id_order: id_order
		},
		select: {
			id:true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Item / menu tidak ditemukan')
	}
}

const checkLogMenuUnavailable = async (id_item) => {
	const result = await prismaClient.log_menu_unavailable.findFirst({
		where: {
			id_item: {in: id_item},
			is_confirm: false
		},
		select: {
			id:true
		}
	})

	if(result){
		throw new ErrorResponse(404, 'Item tidak ditemukan')
	}
}

const get = async (request) => {
	const req = validate(getOrderValidation, request)
	
	const filter = {
		id_merchant: req.id_merchant,
		id_status: Number(req.id_status)
	}
	
	Object.keys(filter).forEach(key => {
		if(filter[key] === undefined){
			delete filter[key]
		}else{
			if(isNaN(filter['id_status'])){
				delete filter['id_status']
			}
		}
	})

	const data = await prismaClient.order.findMany({
		where: filter,
		select: {
			id: true,
			destination: true,
			rel_user: {
				select: {
					name: true,
				}
			},
			rel_subd: {
				select: {
					name: true
				}
			},
			rel_city: {
				select: {
					name: true
				}
			},
			rel_merchant: {
				select: {
					id: true,
					name: true
				}
			},
			rel_courier: {
				select: {
					name: true,
					image: true,
					number_plate: true,
					color: true,
					rel_brand: {
						select: {
							name: true,
							brand: true
						}
					}
				}
			},
			rel_order_item: {
				select: {
					id: true,
					id_menu: true,
					name_menu: true,
					price_menu: true,
					name_variant: true,
					price_variant: true,
					qty: true,
					note: true,
					image: true
				}
			},
			rel_status: {
				select: {
					name: true
				}
			}
		}
	})

	const results = data.map(data => {
		const result = {
			id_order: data.id,
			status: data.rel_status.name,
			...data,
			user: data.rel_user.name,
			destination: data.destination + ', ' + data.rel_subd.name + ', ' + data.rel_city.name,
			merchant: data.rel_merchant,
			courier: {
				name: data?.rel_courier?.name,
				image: data?.rel_courier?.image,
				number_plate: data?.rel_courier?.number_plate,
				vehicle: data?.rel_courier?.rel_brand.brand + ' ' + data?.rel_courier?.rel_brand.name,
				vehicle_color: data?.rel_courier?.color
			},
			items: data.rel_order_item.map(item => ({
				id: item.id,
				id_menu: item.id_menu,
				name: item.name_menu,
				price_menu: item.price_menu,
				variant: item.name_variant,
				price_variant: item.price_variant,
				qty: item.qty,
				note: item.note,
				image: item.image,
				total_price: (Number(item.price_menu) + Number(item.price_variant)) * item.qty
			}))
		}

		delete result.id
		delete result.rel_user
		delete result.rel_subd
		delete result.rel_city
		delete result.rel_merchant
		delete result.rel_courier
		delete result.rel_order_item
		delete result.rel_status

		return result
	})

	return results
}

const reject_OLD = async (filter, body) => {
	const req = validate(decisionValidation, {filter:filter, body:body})

	await checkOrder(req.filter.id_order, req.filter.id_merchant, [1])

	await prismaClient.$transaction(async (tx) => {
		await prismaClient.order.update({
			where: {
				id: req.filter.id_order,
				id_merchant: req.filter.id_merchant,
				id_status: 1
			},
			data: {
				id_status: 3,
				update_at: new Date()
			},
			select: {
				id: true
			}
		})

		await prismaClient.log_order.create({
			data: {
				id: uniqid(),
				id_order: req.filter.id_order,
				id_status: 3,
				detail_status: '',
				change_by: 'Merchant',
				id_changer: req.filter.id_merchant,
				time: new Date()
			},
			select: {
				id: true
			}
		})
	})

	// GET STATUS & DATA COURIER FOR UPDATE STATUS ORDER VIA SOCKET
	const getStatusOrder = await prismaClient.status_order.findUnique({
		where: {
			id: 3
		},
		select: {
			id: true,
			name: true
		}
	})

	const result = {
		status: {
			id: 5,
			message: getStatusOrder.name
		}
	}

	return result
}

const reject = async (filter, body) => {
	const req = validate(decisionValidation, {filter:filter, body:body})

	await checkOrder(req.filter.id_order, req.filter.id_merchant, [1])

	const dataOrder = await getDataOrderForHistory(filter.id_order, filter.id_merchant)
	dataOrder.created_at = new Date()

	const dataOrderItem = await getDataOrderItemForHistory(filter.id_order)

	await prismaClient.$transaction(async (tx) => {
		await tx.history_order.create({
			data: dataOrder
		})

		await tx.history_order_item.createMany({
			data: Object.values(dataOrderItem).map(item => ({
				...item,
				created_at: new Date()
			}))
		})

		await tx.order_item.deleteMany({
			where: {
				id_order: filter.id_order
			}
		})

		await tx.order.delete({
			where: {
				id: req.filter.id_order,
				id_merchant: req.filter.id_merchant
			}
		})

		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: req.filter.id_order,
				id_status: 3,
				detail_status: '',
				change_by: 'Merchant',
				id_changer: req.filter.id_merchant,
				time: new Date()
			},
			select: {
				id: true
			}
		})
	})

	// GET STATUS & DATA COURIER FOR UPDATE STATUS ORDER VIA SOCKET
	const getStatusOrder = await prismaClient.status_order.findUnique({
		where: {
			id: 3
		},
		select: {
			id: true,
			name: true
		}
	})

	const result = {
		status: {
			id: 5,
			message: getStatusOrder.name
		}
	}

	return result
}

const accept = async (filter, body) => {
	const req = validate(decisionValidation, {filter:filter, body:body})

	await checkOrder(req.filter.id_order, req.filter.id_merchant, [1,11])

	// GET STATUS & DATA COURIER FOR UPDATE STATUS ORDER VIA SOCKET
	const getStatusOrder = await prismaClient.status_order.findUnique({
		where: {
			id: 2
		},
		select: {
			id: true,
			name: true
		}
	})

	const getCourier = await prismaClient.courier.findFirst({
		where: {
			id: 'g2pc55b8m9y2c1ox'
		},
		select: {
			name: true,
			number_plate: true,
			color: true,
			image: true,
			rel_brand: {
				select: {
					name: true,
					brand: true
				}
			}
		}
	})

	const dataCourier = {
		name: getCourier.name,
		vehicle: {
			number_plate: getCourier.number_plate,
			vehicle: getCourier.rel_brand.brand + ' ' + getCourier.rel_brand.name,
			vehicle_color: getCourier.color
		}
	}

	delete dataCourier.rel_brand

	// UPDATE ON DATABASE
	// const result = await prismaClient.$transaction(async (tx) => {
	await prismaClient.$transaction(async (tx) => {
		await prismaClient.order.update({
			where: {
				id: req.filter.id_order,
				id_merchant: req.filter.id_merchant,
				id_status: {
					in: [1,11]
				}
			},
			data: {
				id_courier: 'g2pc55b8m9y2c1ox',
				id_status: 2,
				update_at: new Date()
			},
			select: {
				id: true
			}
		})

		await prismaClient.log_order.create({
			data: {
				id: uniqid(),
				id_order: req.filter.id_order,
				id_status: 2,
				detail_status: '',
				change_by: 'Merchant',
				id_changer: req.filter.id_merchant,
				time: new Date()
			},
			select: {
				id: true
			}
		})
	})

	const result = {
		status: {
			id: 2,
			message: getStatusOrder.name
		},
		courier: dataCourier
	}

	return result
}

const unavailable = async (filter, request) => {
	await checkOrder(filter.id_order, filter.id_merchant, [1,2,4,11])

	const req = validate(unavailableValidation, request)

	const idLogOrder = uniqid()

	const result = await prismaClient.$transaction(async (tx) => {
		await tx.order.update({
			where: {
				id: filter.id_order,
				id_merchant: filter.id_merchant,
				id_status: {
					in: [1,2,4,11]
				}
			},
			data: {
				id_status: 4,
				update_at: new Date()
			},
			select: {
				id: true
			}
		})

		await tx.log_order.create({
			data: {
				id: idLogOrder,
				id_order: filter.id_order,
				id_status: 4,
				detail_status: '',
				change_by: 'Merchant',
				id_changer: filter.id_merchant,
				time: new Date()
			},
			select: {
				id: true
			}
		})

		// await Promise.all(
		// 	req.items.map(async item => {
		// 		await checkItem(item.id, filter.id_order)
		// 		return tx.order_item.update({
		// 			where: {
		// 				id: item.id_item,
		// 				id_order: filter.id_order
		// 			},
		// 			data: {
		// 				unavalaible_menu: true,
		// 				update_at: new Date()
		// 			},
		// 			select: {
		// 				id: true
		// 			}
		// 		})
		// 	})
		// 	)

		// const unavailableData = await Promise.all(
		// 	req.items.map(async item => {
		// 		// const available_qty = item.available_qty !== undefined ? item.available_qty : null

		// 		if(!(['menu', 'variant'].includes(item.condition) || /^\d+$/.test(item.condition))){
		// 			throw new ErrorResponse(400, 'Request tidak valid')
		// 		}

		// 		const getItem = await tx.order_item.findUnique({
		// 			where: {
		// 				id: item.id_item
		// 			},
		// 			select: {
		// 				name_menu: true,
		// 				id_variant: true,
		// 				name_variant: true,
		// 				price_menu: true,
		// 				price_variant: true,
		// 				qty: true
		// 			}
		// 		})

		// 		if(/^\d+$/.test(item.condition)){
		// 			if(item.condition >= getItem.qty){
		// 				throw new ErrorResponse(400, 'Jumlah item yang tersedia masih mencukupi jumlah order')
		// 			}
		// 		}

		// 		if(!getItem){
		// 			throw new ErrorResponse(404, 'Item tidak ditemukan')
		// 		}

		// 		return {
		// 			id: uniqid(),
		// 			id_log_order: idLogOrder,
		// 			id_item: item.id_item,
		// 			name_menu: getItem.name_menu,
		// 			id_variant: getItem.id_variant,
		// 			name_variant: getItem.name_variant,
		// 			price_menu: getItem.price_menu,
		// 			price_variant: getItem.price_variant,
		// 			qty: getItem.qty,
		// 			condition: item.condition,
		// 			change_by: 'Merchant',
		// 			id_changer: filter.id_merchant,
		// 			time: new Date()
		// 		}
		// 	})
		// 	)

		const unavailableData = await Promise.all(
			req.items.map(async item => {
				const available_qty = item.available_qty !== undefined ? item.available_qty : 0

				if(!(['menu', 'variant'].includes(item.unavailable) || /^\d+$/.test(item.unavailable))){
					throw new ErrorResponse(400, 'Request tidak valid')
				}

				await checkLogMenuUnavailable([item.id_item])

				const getItem = await tx.order_item.findUnique({
					where: {
						id: item.id_item,
						id_order: filter.id_order
					},
					select: {
						id_menu: true,
						name_menu: true,
						id_variant: true,
						name_variant: true,
						price_menu: true,
						price_variant: true,
						qty: true
					}
				})

				if(!getItem){
					throw new ErrorResponse(404, 'Item tidak ditemukan')
				}

				if(item.available_qty >= getItem.qty){
					throw new ErrorResponse(400, 'Jumlah item yang tersedia masih mencukupi jumlah order')
				}

				return {
					id: uniqid(),
					id_log_order: idLogOrder,
					id_item: item.id_item,
					id_menu: getItem.id_menu,
					name_menu: getItem.name_menu,
					id_variant: getItem.id_variant,
					name_variant: getItem.name_variant,
					price_menu: getItem.price_menu,
					price_variant: getItem.price_variant,
					qty: getItem.qty,
					unavailable_menu: item.unavailable === 'menu',
					unavailable_variant: item.unavailable === 'variant',
					available_qty: available_qty,
					change_by: 'Merchant',
					id_changer: filter.id_merchant,
					time: new Date()
				}
			})
			)

		await tx.log_menu_unavailable.createMany({
			data: unavailableData
		})
	})

	return result
}

const finish = async (ref) => {
	const checkOrder = await prismaClient.order.findFirst({
		where: {
			id: ref.id_order,
			id_merchant: ref.id_merchant,
			id_status: 2
		},
		select: {
			id: true
		}
	})

	if(!checkOrder){
		throw new ErrorResponse(404, 'Order tidak ditemukan')
	}

	await prismaClient.$transaction(async (tx) => {
		await tx.order.update({
			where: {
				id: ref.id_order,
				id_merchant: ref.id_merchant,
				id_status: 2
			},
			data: {
				id_status: 5
			},
			select: {
				id: true
			}
		})

		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: ref.id_order,
				id_status: 5,
				detail_status: '',
				change_by: 'Merchant',
				id_changer: ref.id_merchant,
				time: new Date()
			},
			select: {
				id: true
			}
		})
	})

	// GET STATUS & DATA COURIER FOR UPDATE STATUS ORDER VIA SOCKET
	const getStatusOrder = await prismaClient.status_order.findUnique({
		where: {
			id: 5
		},
		select: {
			id: true,
			name: true
		}
	})

	const result = {
		status: {
			id: 5,
			message: getStatusOrder.name
		}
	}

	return result
}

export default {
	get,
	accept,
	reject,
	unavailable,
	finish
}