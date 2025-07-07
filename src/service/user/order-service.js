import {validate} from '../../validation/validation.js'
import {
	createOrderValidation,
	cancelOrderValidation,
	getOrderValidation,
	confirmValidation
} from '../../validation/user/order-validation.js'
import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'
import uniqid from 'uniqid'
import {logger} from '../../application/logger.js'
import systemCostService from '../../service/public/cost-service.js'

const getIdLogOrderByUser = async (id_user) => {
	const result = await prismaClient.$transaction(async (tx) => {
		const idOrder = await tx.order.findFirst({
			where: {
				id_user: id_user
			},
			select: {
				id: true
			}
		})

		if(!idOrder){
			throw new ErrorResponse(404, 'Order tidak ditemukan')
		}
		logger.info('ID ORDER: '+idOrder.id)
		// OLD
		// return tx.log_order.findMany({
		// 	where: {
		// 		id_order: idOrder.id,
		// 		id_status: 4
		// 	},
		// 	// orderBy: {
		// 	// 	time: 'desc'
		// 	// },
		// 	select: {
		// 		id: true
		// 	}
		// })

		// NEW
		const logs = await tx.log_order.findMany({
			where: {
				id_order: idOrder.id
			},
			orderBy: {
				time: 'desc'
			},
			select: {
				id: true,
				id_status: true
			}
		})

		const result = []
		for(const log of logs){
			if(log.id_status === 4){
				result.push(log)
			}else{
				break
			}
		}

		return result
	})

	// if(!result){
	// if(result.length === 0){
	// 	throw new ErrorResponse(404, 'Item tidak ditemukan')
	// }

	return result.map(i => i.id)
}

const getOrderForSocket = async (idOrder) => {
	const data = await prismaClient.order.findFirst({
		where: {
			id: idOrder
		},
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
					note: true
				}
			},
			rel_status: {
				select: {
					name: true
				}
			}
		}
	})

	
	const result = {
		id_order: data.id,
		status: data.rel_status.name,
		...data,
		user: data.rel_user.name,
		destination: data.destination + ', ' + data.rel_subd.name + ', ' + data.rel_city.name,
		merchant: data.rel_merchant,
		courier: {
			name: data?.rel_courier?.name,
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
}

const create_OLD = async (ref, request) => {
	const req = validate(createOrderValidation, request)

	const id_menu = req.items.map(item => item.id_menu)
	const findMenu = await prismaClient.menu.findMany({
		where: {
			id: {in: id_menu},
			id_merchant: ref.id_merchant
		},
		select: {
			id: true,
			name: true,
			price: true
		}
	})

	if(findMenu.length !== id_menu.length){
		throw new ErrorResponse(400, 'Beberapa menu tidak ditemukan / tidak sesuai dengan merchant')
	}

	logger.info('id_user: '+ref.id_user)

	const user = await prismaClient.user.findUnique({
		where: {
			id: ref.id_user
		},
		select: {
			name: true
		}
	})

	logger.info('id_merchant: '+ref.id_merchant)
	const merchant = await prismaClient.merchant.findUnique({
		where: {
			id: ref.id_merchant
		},
		select: {
			name: true
		}
	})

	logger.info('id_courier: manual')
	const courier = await prismaClient.courier.findUnique({
		where: {
			id: 'g2pc55b8m9y2c1ox'
		},
		select: {
			name: true
		}
	})

	logger.info('id_subd: '+req.id_subd)
	const subd = await prismaClient.subdistrict.findUnique({
		where: {
			id: req.id_subd
		},
		select: {
			name: true
		}
	})

	logger.info('id_city: '+req.id_city)
	const city = await prismaClient.city.findUnique({
		where: {
			id: req.id_city
		},
		select: {
			name: true
		}
	})

	logger.info('id_prov: '+req.id_prov)
	const prov = await prismaClient.province.findUnique({
		where: {
			id: req.id_prov
		},
		select: {
			name: true
		}
	})

	const name_menu = {}
	const price = {}
	findMenu.forEach(item => {
		name_menu[item.id] = item.name
		price[item.id] = item.price
	})

	const id_variant = req.items.map(item => item.id_variant)
	const findVariant = await prismaClient.variant_item.findMany({
		where: {
			id: {in: id_variant},
			rel_variant: {
				rel_menu: {
					id: {in: req.items.map(item => item.id_menu)}
				}
			}
		},
		select: {
			id: true,
			name: true,
			price: true
		}
	})

	const name_variant = {}
	const price_variant = {}
	findVariant.forEach(item => {
		name_variant[item.id] = item.name
		price_variant[item.id] = item.price
	})

	const idOrder = uniqid()
	const result = await prismaClient.$transaction(async (tx) => {
		await tx.order.create({
			data: {
				id: idOrder,
				id_user: ref.id_user,
				name_user: user.name,
				id_merchant: ref.id_merchant,
				name_merchant: merchant.name,
				id_courier: 'g2pc55b8m9y2c1ox',
				name_courier: courier.name,
				destination: req.destination,
				id_subd: req.id_subd,
				name_subd: subd.name,
				id_city: req.id_city,
				name_city: city.name,
				id_prov: req.id_prov,
				name_prov: prov.name,
				shipping_cost: '1000',
				created_at: new Date()
			},
			select: {
				name_merchant: true
			}
		})

		logger.info('id_menu: '+id_menu)
		logger.info('idOrder: '+idOrder)

		const itemData = req.items.map((item) => ({
			id: uniqid(),
			id_menu: item.id_menu,
			name_menu: name_menu[item.id_menu],
			id_variant: item.id_variant,
			name_variant: name_variant[item.id_variant],
			qty: item.qty,
			note: item.note,
			price: price[item.id_menu],
			id_order: idOrder,
			created_at: new Date()
		}))

		await tx.order_item.createMany({
			data: itemData
		})

		logger.info('itemData: '+itemData)
	})

	return result
}

const create = async (ref, request) => {
	const req = validate(createOrderValidation, request)

	// CHECK MERCHANT IS OPEN
	const checkIsOpen = await prismaClient.merchant.findFirst({
		where: {
			id: ref.id_merchant,
			is_open: true
		}
	})

	if(!checkIsOpen){
		throw new ErrorResponse(403, 'Kamu tidak dapat membuat pesanan karena merchant sedang tutup')
	}

	// CHECK ORDER
	const checkOrder = await prismaClient.order.findFirst({
		where: {
			id_user: ref.id_user
		},
		select: {
			id: true
		}
	})

	if(checkOrder){
		throw new ErrorResponse(403, 'Pesananmu ditolak karena kamu masih punya pesanan yang belum selesai')
	}

	// const id_menu = req.items.map(item => item.id_menu)
	// CHECK MENU IN DATABASE
	const id_menu = [...new Set(req.items.map(item => item.id_menu))]
	const findMenu = await prismaClient.menu.findMany({
		where: {
			id: {in: id_menu},
			id_merchant: ref.id_merchant,
			is_ready: true
		},
		select: {
			id: true,
			name: true,
			price: true,
			image: true
		}
	})

	if(findMenu.length !== id_menu.length){
		throw new ErrorResponse(404, 'Beberapa menu tidak ditemukan / tidak tersedia / tidak sesuai dengan merchant')
	}

	// const [user, merchant, courier, subd, city, prov] = await Promise.all([
	// 	prismaClient.user.findUnique({ where: {id: ref.id_user}, select: {name: true} }),
	// 	prismaClient.merchant.findUnique({ where: {id: ref.id_merchant}, select: {name: true} }),
	// 	prismaClient.courier.findUnique({ where: {id: 'g2pc55b8m9y2c1ox'}, select: {name: true} }),
	// 	prismaClient.subdistrict.findUnique({ where: {id: req.id_subd}, select: {name: true} }),
	// 	prismaClient.city.findUnique({ where: {id: req.id_city}, select: {name: true} }),
	// 	prismaClient.province.findUnique({ where: {id: req.id_prov}, select: {name: true} })
	// ])

	const name_menu = {}
	const price_menu = {}
	const image_menu = {}
	findMenu.forEach(item => {
		name_menu[item.id] = item.name
		price_menu[item.id] = item.price
		image_menu[item.id] = item.image
	})

	// CHECK VARIANT IN DATABASE
	const id_variant = req.items.map(item => item.id_variant)
	// const findVariant = await prismaClient.variant_item.findMany({
	// 	where: {
	// 		id: {in: id_variant},
	// 		is_ready: true,
	// 		rel_variant: {
	// 			rel_menu: {
	// 				id: {in: req.items.map(item => item.id_menu)}
	// 			}
	// 		}
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		price: true
	// 	}
	// })

	// if(findVariant.length !== id_variant.length){
	// 	throw new ErrorResponse(400, 'Varian tidak ditemukan / tidak sesuai dengan menu')
	// }

	// const findVariant = await Promise.all(
	// 	req.items.map(async item => {
	// 		return prismaClient.variant_item.findFirst({
	// 			where: {
	// 				id: item.id_variant,
	// 				is_ready: true,
	// 				rel_variant: {
	// 					rel_menu: {
	// 						id: item.id_menu
	// 					}
	// 				}
	// 			},
	// 			select: {
	// 				id: true,
	// 				name: true,
	// 				price: true,
	// 				rel_variant: {
	// 					select: {
	// 						rel_menu: {
	// 							select: {
	// 								id: true
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		})
	// 	})
	// 	)

	const findVariant = await prismaClient.menu.findMany({
		where: {
			id: {in: req.items.map(item => item.id_menu)},
			is_ready: true
		},
		select: {
			id: true,
			rel_variant: {
				select: {
					rel_variant_item: {
						select: {
							id: true,
							name: true,
							price: true,
							is_ready: true
						}
					}
				}
			}
		}
	})

	console.dir(findVariant, {depth: null})
	const menuWithVariantFromDb = {}
	findVariant.forEach(item => {
		menuWithVariantFromDb[item.id] = item?.rel_variant.flatMap(v => v.rel_variant_item || []) || []
	})
	console.log(menuWithVariantFromDb, {depth: null})
	const name_variant = {}
	const price_variant = {}
	req.items.forEach(item => {
		const variantList = menuWithVariantFromDb[item.id_menu]
		if(variantList.length > 0){
			if(!item.id_variant){
				throw new ErrorResponse(400, 'Harap pilih varian pada menu yang memiliki varian')
			}

			if(!variantList.find(v => v.id === item.id_variant && v.is_ready)){
				throw new ErrorResponse(400, 'Ada beberapa varian yang tidak tersedia')
			}
		}else{
			if(item.id_variant){
				throw new ErrorResponse(400, 'Kamu tidak boleh mengisi varian pada menu yang tidak memiliki varian')
			}
		}

		const variantData = variantList.find(v => v.id === item.id_variant)
		console.log(item)
		console.log(variantData)
		name_variant[item?.id_variant] = variantData?.name || null
		price_variant[item?.id_variant] = variantData?.price || 0
	})

	// findVariant.forEach(item => {
	// 	name_variant[item.id] = item.name
	// 	price_variant[item.id] = item.price
	// })

	logger.info('id_user: '+ref.id_user)
	const idOrder = uniqid()
	const dataSystemCost = await systemCostService.getSystemCost(req.destination)
	await prismaClient.$transaction(async (tx) => {
		await tx.order.create({
			data: {
				id: idOrder,
				id_user: ref.id_user,
				// name_user: user.name,
				id_merchant: ref.id_merchant,
				// name_merchant: merchant.name,
				// id_courier: null,
				// name_courier: courier.name,
				destination: req.destination,
				id_subd: req.id_subd,
				// name_subd: subd.name,
				id_city: req.id_city,
				// name_city: city.name,
				id_prov: req.id_prov,
				// name_prov: prov.name,
				id_status: 1,
				shipping_cost: dataSystemCost.shipping_cost,
				service_cost: dataSystemCost.service_cost,
				created_at: new Date()
			},
			select: {
				id: true
			}
		})

		console.log(name_variant)
		console.log(price_variant)
		logger.info('id_menu: '+id_menu)
		logger.info('idOrder: '+idOrder)

		const itemData = req.items.map((item) => ({
			id: uniqid(),
			id_menu: item.id_menu,
			name_menu: name_menu[item.id_menu],
			id_variant: item.id_variant || null,
			name_variant: name_variant[item.id_variant],
			qty: item.qty,
			note: item.note,
			price_menu: price_menu[item.id_menu],
			price_variant: price_variant[item.id_variant],
			image: image_menu[item.id_menu],
			id_order: idOrder,
			created_at: new Date()
		}))

		await tx.order_item.createMany({
			data: itemData
		})

		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: idOrder,
				id_status: 1,
				detail_status: '',
				change_by: 'User',
				id_changer: ref.id_user,
				time: new Date()
			}
		})
	})

	const result = getOrderForSocket(idOrder)

	return result
}

const cancel = async (id_user) => {
	validate(cancelOrderValidation, id_user)

	const findOrder = await prismaClient.order.findFirst({
		where: {
			id_user: id_user,
			id_status: {
				in: [1,4]
			}
		},
		select: {
			id: true,
			id_user: true,
			id_merchant: true,
			id_courier: true,
			destination: true,
			shipping_cost: true,
			service_cost: true,
			id_city: true,
			id_subd: true,
			id_prov: true,
			id_status: true,
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
			rel_city: {
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
			rel_prov: {
				select: {
					id: true,
					name: true
				}
			}
		}
	})

	if(!findOrder){
		throw new ErrorResponse(404, 'Order tidak ditemukan')
	}

	if(![1,4].includes(findOrder.id_status)){
		throw new ErrorResponse(400, 'Kamu tidak dapat membatalkan pesanan ini')
	}

	const findOrderItem = await prismaClient.order_item.findMany({
		where: {
			id_order: findOrder.id
		}
		// select: {
		// 	id: true,
		// 	id_menu: true,
		// 	name_menu: true,
		// 	price_menu: true,
		// 	id_variant: true,
		// 	name_variant: true,
		// 	price_variant: true,
		// 	id_order: true,
		// 	qty: true,
		// 	note: true
		// }
	})

	return prismaClient.$transaction(async (tx) => {
		// ADD TO HISTORY ORDER
		// try{
		await tx.history_order.create({
			data: {
				id: findOrder.id,
				id_user: findOrder.id_user,
				name_user: findOrder.rel_user.name,
				id_merchant: findOrder.id_merchant,
				name_merchant: findOrder.rel_merchant.name,
				id_courier: findOrder?.id_courier,
				name_courier: findOrder?.rel_courier?.name,
				destination: findOrder.destination,
				shipping_cost: findOrder.shipping_cost,
				service_cost: findOrder.service_cost,
				id_city: findOrder.id_city,
				name_city: findOrder.rel_city.name,
				id_subd: findOrder.id_subd,
				name_subd: findOrder.rel_subd.name,
				id_prov: findOrder.id_prov,
				name_prov: findOrder.rel_prov.name,
				created_at: new Date()
			}
		})
		// }catch(error){
		// 	throw new ErrorResponse(500, 'Server error')
		// }

		// ADD TO HISTORY ORDER ITEM
		// try{
		await tx.history_order_item.createMany({
			data: findOrderItem.map(item => ({
				id: item.id,
				id_menu: item.id_menu,
				name_menu: item.name_menu,
				price_menu: item.price_menu,
				id_variant: item.id_variant,
				name_variant: item.name_variant,
				price_variant: item.price_variant,
				id_order: item.id_order,
				qty: item.qty,
				note: item.note,
				image: item.image,
				created_at: new Date()
			}))
		})
		// }catch(error){
		// 	throw new ErrorResponse(500, 'Server error')
		// }

		// ADD TO LOG ORDER
		// try{
		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: findOrder.id,
				id_status: 12,
				detail_status: null,
				change_by: 'user',
				id_changer: id_user,
				time: new Date()
			}
		})
		// }catch(error){
		// 	throw new ErrorResponse(500, 'Server error')
		// }

		// DELETE FROM ORDER ITEM
		// try{
		await tx.order_item.deleteMany({
			where: {
				id_order: findOrder.id
			}
		})
		// }catch(error){
		// 	throw new ErrorResponse(500, 'Server error')
		// }

		// DELETE FROM ORDER
		// try{
		await tx.order.delete({
			where: {
				id: findOrder.id
			}
		})
		// }catch(error){
		// 	throw new ErrorResponse(500, 'Server error')
		// }
	})
}

const get = async (id_user) => {
	const req = validate(getOrderValidation, id_user)

	const idLogOrder = await getIdLogOrderByUser(id_user)
	const idItemUnavailableData = await prismaClient.log_menu_unavailable.findMany({
		where: {
			id_log_order: {
				in: idLogOrder
			},
			is_confirm: false
		},
		select: {
			id_item: true
		}
	})

	const idItemUnavailable = idItemUnavailableData.map(i => i.id_item)

	const data = await prismaClient.order.findFirst({
		where: {
			id_user: id_user
		},
		select: {
			id: true,
			destination: true,
			shipping_cost: true,
			service_cost: true,
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
					name: true,
					image: true
				}
			},
			rel_courier: {
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
			},
			rel_order_item: {
				where: {
					id: {
						notIn: idItemUnavailable
					}
				},
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
					id: true,
					name: true
				}
			}
		}
	})

	let dataCourier = {}
	// dataCourier.rel_brand = {}

	if(data.rel_courier){
		// dataCourier = data.rel_courier

		dataCourier = {
			name: data.rel_courier.name,
			image: data.rel_courier.image,
			number_plate: data.rel_courier.number_plate,
			vehicle: data.rel_courier.rel_brand.brand + ' ' + data.rel_courier.rel_brand.name,
			vehicle_color: data.rel_courier.color
		}
	}else{
		dataCourier = null
	}

	const result = {
		id_order: data.id,
		status: {
			id: data.rel_status.id,
			message: data.rel_status.name,
			
		},
		...data,
		destination: data.destination + ', ' + data.rel_subd.name + ', ' + data.rel_city.name,
		merchant: data.rel_merchant,
		// courier: {
		// 	name: dataCourier.name,
		// 	number_plate: dataCourier.number_plate,
		// 	vehicle: dataCourier.rel_brand.brand + ' ' + dataCourier.rel_brand.name,
		// 	vehicle_color: dataCourier.color
		// },
		courier: dataCourier,
		items: data.rel_order_item.map(item => ({
			id: item.id,
			id_menu: item.id_menu,
			name_menu: item.name_menu,
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
	delete result.rel_subd
	delete result.rel_city
	delete result.rel_merchant
	delete result.rel_courier
	delete result.rel_order_item
	delete result.rel_status

	return result
}

const getUnavailable = async (id_user) => {
	const req = validate(getOrderValidation, id_user)

	const idLogOrder = await getIdLogOrderByUser(id_user)

	const data = await prismaClient.log_menu_unavailable.findMany({
		where: {
			id_log_order: {
				in: idLogOrder
			},
			is_confirm: false
		},
		select: {
			id_item: true,
			id_menu: true,
			name_menu: true,
			price_menu: true,
			name_variant: true,
			price_variant: true,
			qty: true,
			unavailable_menu: true,
			unavailable_variant: true,
			available_qty: true,
			note: true
		}
	})

	const result = data.map(item => {
		let unavailable
		if(item.unavailable_menu){
			unavailable = 'menu'
		}else if(item.unavailable_variant){
			unavailable = 'variant'
		}else{
			unavailable = 'unknown'
		}	

		const newItem = {
			...item,
			unavailable: unavailable
		}

		delete newItem.unavailable_menu
		delete newItem.unavailable_variant

		return newItem
	})

	return result
}

const confirm_OLD = async (id_user, request) => {
	const req = validate(confirmValidation, request)

	const checkStatusOrder = await prismaClient.order.findFirst({
		where: {
			rel_user: {
				id: id_user
			},
			id_status: 4
		},
		select: {
			id_status: true
		}
	})

	if(!checkStatusOrder){
		throw new ErrorResponse(422, 'Action denied')
	}

	const idLogOrder = await getIdLogOrderByUser(id_user)

	await prismaClient.$transaction(async (tx) => {
		const getIdMerchant = await tx.order.findFirst({
			where: {
				id_user: id_user
			},
			select: {
				id_merchant: true
			}
		})

		// CHECK MENU IN DATABASE
		const id_menu = [...new Set(req.items.map(item => item.id_menu))]
		const findMenu = await tx.menu.findMany({
			where: {
				id: {in: id_menu},
				id_merchant: getIdMerchant.id_merchant,
				is_ready: true
			},
			select: {
				id: true,
				name: true,
				price: true
			}
		})

		if(findMenu.length !== id_menu.length){
			throw new ErrorResponse(400, 'Beberapa menu tidak ditemukan / tidak sesuai dengan merchant')
		}

		const name_menu = {}
		const price_menu = {}
		findMenu.forEach(item => {
			name_menu[item.id] = item.name
			price_menu[item.id] = item.price
		})

		// CHECK VARIANT IN DATABASE
		const id_variant = req.items.map(item => item.id_variant)
		const findVariant = await tx.variant_item.findMany({
			where: {
				id: {in: id_variant},
				is_ready: true,
				rel_variant: {
					rel_menu: {
						id: {in: req.items.map(item => item.id_menu)}
					}
				}
			},
			select: {
				id: true,
				name: true,
				price: true
			}
		})

		// const findVariant = await Promise.all(
		// 	req.items.map(async item => {
		// 		return tx.variant_item.findFirst({
		// 			where: {
		// 				id: item.id_variant,
		// 				is_ready: true,
		// 				rel_variant: {
		// 					rel_menu: {
		// 						id: item.id_menu
		// 					}
		// 				}
		// 			},
		// 			select: {
		// 				id: true,
		// 				name: true,
		// 				price: true
		// 			}
		// 		})
		// 	})
		// 	)

		if(findVariant.length !== id_variant.length){
			throw new ErrorResponse(400, 'Varian tidak ditemukan / tidak sesuai dengan menu')
		}

		const name_variant = {}
		const price_variant = {}
		findVariant.forEach(item => {
			name_variant[item.id] = item.name
			price_variant[item.id] = item.price
		})

		let idItemUnavailable = await tx.log_menu_unavailable.findMany({
			where: {
				id_log_order: {
					in: idLogOrder
				}
			},
			select: {
				id_item: true
			}
		})

		idItemUnavailable = idItemUnavailable.map(i => i.id_item)

		let idOrderItemUnavailableInDb = await tx.order_item.findMany({
			where: {
				id: {
					in: idItemUnavailable
				}
			},
			select: {
				id: true
			}
		})
		idOrderItemUnavailableInDb = idOrderItemUnavailableInDb.map(i => i.id)

		const reqIdItem = req.items.filter(i => i.id).map(i => i.id)
		const lostIdItem = idOrderItemUnavailableInDb.filter(i => !reqIdItem.includes(i))

		if(lostIdItem.length > 0){
			await tx.order_item.deleteMany({
				where: {
					in: lostIdItem
				}
			})
		}

		let getIdLogMenuUnavailable = await tx.log_menu_unavailable.findMany({
			where: {
				id_item: {
					in: req.items.id
				}
			},
			orderBy: {
				time: 'desc'
			},
			select: {
				id: true
			}
		})
		getIdLogMenuUnavailable = getIdLogMenuUnavailable.map(i => i.id)

		await Promise.all(
			req.items.filter(i => i.id).map(async i => {
				return Promise.all([
					tx.order_item.update({
						where: {
							id: i.id,
							rel_order: {
								id_user: id_user
							}
						},
						data: {
							qty: i.qty,
							note: i.note,
							update_at: new Date()
						},
						select: {
							name_menu: true
						}
					})
				])
			})
			)

		await tx.log_menu_unavailable.updateMany({
			where: {
				id: {
					in: getIdLogMenuUnavailable
				}
			},
			data: {
				is_confirm: true
			}
		})	

		await tx.order_item.createMany({
			data: req.items.filter(i => !i.id).map(i => ({
				id: uniqid(),
				id_menu: item.id_menu,
				name_menu: name_menu[item.id_menu],
				id_variant: item.id_variant,
				name_variant: name_variant[item.id_variant],
				qty: item.qty,
				note: item.note,
				price_menu: price_menu[item.id_menu],
				price_variant: price_variant[item.id_variant],
				id_order: idOrder,
				created_at: new Date()
			}))
		})
	})
}

const confirm = async (id_user, request) => {
	const req = validate(confirmValidation, request)

	// const reqIdItem = req.items.map(item => item.id)
	const idLogOrder = await getIdLogOrderByUser(id_user)

	// CHECK STATUS = 4 BY ID USER AND ITEM UNAVAILABLE FOR VALIDATE
	const checkStatusOrder = await Promise.all([
		prismaClient.order.findFirst({
			where: {
				id_user: id_user,
				id_status: 4
			},
			select: {
				id_status: true
			}
		})
	])
	
	if(!checkStatusOrder){
		throw new ErrorResponse(404, 'Item tidak ditemukan')
	}

	logger.info(req.items.filter(i => i.id).map(i => i.id))
	await Promise.all(
		req.items.filter(i => i.id).map(async item => {
			const checkItemUnavailable = await prismaClient.log_menu_unavailable.findFirst({
				where: {
					id_item: item.id,
					id_log_order: {
						in: idLogOrder
					},
					is_confirm: false
				},
				select: {
					id_item: true
				}
			})
			if(!checkItemUnavailable){
				throw new ErrorResponse(404, 'Item tidak ditemukan')
			}

			// CHECK QTY
			const availableQty = await prismaClient.log_menu_unavailable.findFirst({
				where: {
					id_item: item.id,
					is_confirm: false
				},
				select: {
					available_qty: true
				}
			})

			if(item.qty > availableQty.available_qty){
				throw new ErrorResponse(402, 'Jumlah item melebihi jumlah stok yang tersedia')
			}

			if(item.qty <= 0){
				throw new ErrorResponse(402, 'Jumlah item minimal 1')
			}
		})
		)

	// # CHECK MENU AND VARIANT BY MERCHANT FOR CHANGE MENU (CREATE ORDER ITEM)
	const name_menu = {}
	const price_menu = {}
	const name_variant = {}
	const price_variant = {}
	await Promise.all(
		req.items.filter(i => !i.id).map(async item => {
			const getIdMerchant = await prismaClient.order.findFirst({
				where: {
					id_user: id_user
				},
				select: {
					id_merchant: true
				}
			})

			// ## CHECK MENU
			const checkMenu = await prismaClient.menu.findFirst({
				where: {
					id: item.id_menu,
					id_merchant: getIdMerchant.id_merchant,
					is_ready: true
				},
				select: {
					id: true,
					name: true,
					price: true
				}
			})

			if(!checkMenu){
				throw new ErrorResponse(404, 'Menu tidak ditemukan / tidak sesuai dengan merchant')
			}

			// ## CHECK VARIANT
			const checkVariant = await prismaClient.variant_item.findFirst({
				where: {
					id: item.id_variant,
					is_ready: true,
					rel_variant: {
						rel_menu: {
							id: item.id_menu
						}
					}
				},
				select: {
					id: true,
					name: true,
					price: true
				}
			})

			if(!checkVariant){
				throw new ErrorResponse(404, 'Varian tidak ditemukan / tidak sesuai dengan menu')
			}

			// GET NAME AND PRICE MENU
			name_menu[item.id_menu] = checkMenu.name
			price_menu[item.id_menu] = checkMenu.price

			// GET NAME AND PRICE VARIANT
			name_variant[item.id_variant] = checkVariant.name
			price_variant[item.id_variant] = checkVariant.price
		})
		)

	// PROCESS
	await prismaClient.$transaction(async (tx) => {
		// UPDATE QTY ITEM WITH WHERE BY ID ITEM AND ID USER AND UPDATE LOG_MENU_UNAVAILABLE
		await Promise.all(
			req.items.filter(i => i.id).map(async i => {
				return Promise.all([
					tx.order_item.update({
						where: {
							id: i.id,
							rel_order: {
								id_user: id_user
							}
						},
						data: {
							qty: i.qty,
							note: i.note,
							update_at: new Date()
						},
						select: {
							id: true
						}
					})
				])
			})
			)

		// CREATE NEW ITEM FROM CHANGE MENU
		const idOrder = await tx.order.findFirst({
			where: {
				id_user: id_user
			},
			select: {
				id: true
			}
		})

		await tx.order_item.createMany({
			data: req.items.filter(i => !i.id).map(item => ({
				id: uniqid(),
				id_menu: item.id_menu,
				name_menu: name_menu[item.id_menu],
				id_variant: item.id_variant,
				name_variant: name_variant[item.id_variant],
				qty: item.qty,
				note: item.note,
				price_menu: price_menu[item.id_menu],
				price_variant: price_variant[item.id_variant],
				id_order: idOrder.id,
				created_at: new Date()
			}))
		})

		// DELETE ITEM
		const itemUnavailable = await tx.log_menu_unavailable.findMany({
			where: {
				id_log_order: {
					in: idLogOrder
				}
			},
			select: {
				id_item: true
			}
		})

		const idItemInDb = await tx.order_item.findMany({
			where: {
				id: {
					in: itemUnavailable.map(item => item.id_item)
				}
			},
			select: {
				id: true
			}
		})

		const reqIdItemForDelete = req.items.filter(i => i.id).map(i => i.id)
		const lostItem = idItemInDb.filter(i => !reqIdItemForDelete.includes(i.id)).map(i => i.id)

		if(lostItem.length > 0){
			await tx.order_item.deleteMany({
				where: {
					id: {
						in: lostItem
					}
				}
			})	
		}

		// # UPDATE STATUS ORDER AND CREATE LOG ORDER
		// ## UPDATE STATUS ORDER
		await tx.order.update({
			where: {
				id: idOrder.id
			},
			data: {
				id_status: 11,
				update_at: new Date()
			},
			select: {
				id: true
			}
		})

		// ## CREATE LOG ORDER
		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: idOrder.id,
				id_status: 11,
				detail_status: '',
				change_by: 'User',
				id_changer: id_user,
				time: new Date()
			}
		})

		// UPDATE IS CONFIRM
		await prismaClient.log_menu_unavailable.updateMany({
			where: {
				id_item: {
					in: req.items.map(item => item.id).filter(id => id !== undefined)
				},
				is_confirm: false
			},
			data: {
				is_confirm: true
			}
		})
	})
}

export default {
	create,
	cancel,
	get,
	getUnavailable,
	confirm
}