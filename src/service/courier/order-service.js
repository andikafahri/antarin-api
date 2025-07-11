import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'
import uniqid from 'uniqid'

const checkCourier = async (id_courier) => {
	const findCourier = await prismaClient.courier.findUnique({
		where: {
			id: id_courier
		},
		select: {
			id: true
		}
	})

	if(!findCourier){
		throw new ErrorResponse(404, 'Kurir tidak ditemukan / tidak terdaftar')
	}
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

const getDataOrderForHistory = async (id_courier) => {
	const data = await prismaClient.order.findFirst({
		where: {
			id_courier: id_courier
		},
		select: {
			id: true,
			destination: true,
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

const get = async (id_courier) => {
	await checkCourier(id_courier)

	const data = await prismaClient.order.findFirst({
		where: {
			id_courier: id_courier
		},
		select: {
			id: true,
			destination: true,
			shipping_cost: true,
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
					name: true,
					address: true,
					rel_subd: {
						select: {
							name: true
						}
					},
					rel_city: {
						select: {
							name: true
						}
					}
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

	// const results = data.map(data => {
	const result = {
		id_order: data.id,
		status: data.rel_status.name,
		...data,
		user: data.rel_user.name,
		destination: data.destination + ', ' + data.rel_subd.name + ', ' + data.rel_city.name,
			// merchant: data.rel_merchant,
		merchant: {
			name: data.rel_merchant.name,
			address: data.rel_merchant.address + ', ' + data.rel_merchant.rel_subd.name + ', ' + data.rel_merchant.rel_city.name
		},
		courier: {
			name: data.rel_courier.name,
			number_plate: data.rel_courier.number_plate,
			vehicle: data.rel_courier.rel_brand.brand + ' ' + data.rel_courier.rel_brand.name,
			vehicle_color: data.rel_courier.color
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
	// })

	return result
}

const deliver = async (id_courier) => {
	await checkCourier(id_courier)

	const findOrder = await prismaClient.order.findFirst({
		where: {
			id_courier: id_courier
		},
		select: {
			id: true,
			id_status: true
		}
	})

	if(!findOrder){
		throw new ErrorResponse(404, 'Order tidak ditemukan')
	}

	if([1,2,3,4].includes(findOrder.id_status)){
		throw new ErrorResponse(404, 'Order masih dalam proses oleh merchant')
	}

	if(findOrder.id_status === 6){
		throw new ErrorResponse(400, 'Order sudah dalam proses pengantaran')
	}

	await prismaClient.$transaction(async (tx) => {
		const update = await tx.order.update({
			where: {
				id: findOrder.id,
				id_status: 5
			},
			data: {
				id_status: 6,
				update_at: new Date()
			},
			select: {
				id: true
			}
		})

		if(update.count === 0){
			throw new ErrorResponse(400, 'Update order failed')
		}

		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: findOrder.id,
				id_status: 6,
				detail_status: '',
				change_by: 'Courier',
				id_changer: id_courier,
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
			id: 6
		},
		select: {
			id: true,
			name: true
		}
	})

	// const result = {
	// 	id_order: findOrder.id,
	// 	id_merchant: findOrder.id_merchant,
	// 	status: {
	// 		id: getStatusOrder.id,
	// 		message: getStatusOrder.name
	// 	}
	// }

	const result = getOrderForSocket(findOrder.id)

	return result
}

const delivered = async (id_courier) => {
	await checkCourier(id_courier)

	const findOrder = await prismaClient.order.findFirst({
		where: {
			id_courier: id_courier
		},
		select: {
			id: true,
			id_status: true
		}
	})

	if(!findOrder){
		throw new ErrorResponse(404, 'Order tidak ditemukan / belum dalam proses pengantaran')
	}

	if([1,2,3,4].includes(findOrder.id_status)){
		throw new ErrorResponse(404, 'Order masih dalam proses oleh merchant')
	}

	if(findOrder.id_status === 5){
		throw new ErrorResponse(400, 'Kamu harus mengambil pesanan ke merchant dahulu')
	}

	if(findOrder.id_status === 61){
		throw new ErrorResponse(400, 'Kamu sudah sampai tujuan')
	}

	await prismaClient.$transaction(async (tx) => {
		await tx.order.update({
			where: {
				id: findOrder.id,
				id_status: 6
			},
			data: {
				id_status: 61,
				update_at: new Date()
			},
			select: {
				id: true
			}
		})

		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: findOrder.id,
				id_status: 61,
				detail_status: '',
				change_by: 'Courier',
				id_changer: id_courier,
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
			id: 61
		},
		select: {
			id: true,
			name: true
		}
	})

	const result = {
		id_order: findOrder.id,
		status: {
			id: 61,
			message: getStatusOrder.name
		}
	}

	return result
}

const finish_OLD = async (id_courier) => {
	await checkCourier(id_courier)

	const findOrder = await prismaClient.order.findFirst({
		where: {
			id_courier: id_courier
		},
		select: {
			id: true,
			id_status: true
		}
	})

	if(!findOrder){
		throw new ErrorResponse(404, 'Order tidak ditemukan / belum dalam proses pengantaran')
	}

	if([1,2,3,4].includes(findOrder.id_status)){
		throw new ErrorResponse(404, 'Order masih dalam proses oleh merchant')
	}

	if(findOrder.id_status === 5){
		throw new ErrorResponse(400, 'Kamu harus mengambil pesanan ke merchant dahulu')
	}

	if(findOrder.id_status === 6){
		throw new ErrorResponse(400, 'Harap antar pesanan sampai ke alamt tujuan')
	}

	if(findOrder.id_status === 7){
		throw new ErrorResponse(400, 'Pesanan sudah diselesaikan')
	}

	await prismaClient.$transaction(async (tx) => {
		await tx.order.update({
			where: {
				id: findOrder.id,
				id_status: 61
			},
			data: {
				id_status: 7,
				update_at: new Date()
			},
			select: {
				id: true
			}
		})

		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: findOrder.id,
				id_status: 7,
				detail_status: '',
				change_by: 'Courier',
				id_changer: id_courier,
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
			id: 7
		},
		select: {
			id: true,
			name: true
		}
	})

	const result = {
		id_order: findOrder.id,
		status: {
			id: 7,
			message: getStatusOrder.name
		}
	}

	return result
}

const finish = async (id_courier) => {
	await checkCourier(id_courier)

	const dataOrder = await getDataOrderForHistory(id_courier)
	const dataOrderItem = await getDataOrderItemForHistory(dataOrder.id)

	const findOrder = await prismaClient.order.findFirst({
		where: {
			id_courier: id_courier
		},
		select: {
			id_status: true
		}
	})
	const idOrder = findOrder.id

	if(!findOrder){
		throw new ErrorResponse(404, 'Order tidak ditemukan / belum dalam proses pengantaran')
	}

	if([1,2,3,4].includes(findOrder.id_status)){
		throw new ErrorResponse(404, 'Order masih dalam proses oleh merchant')
	}

	if(findOrder.id_status === 5){
		throw new ErrorResponse(400, 'Kamu harus mengambil pesanan ke merchant dahulu')
	}

	if(findOrder.id_status === 6){
		throw new ErrorResponse(400, 'Harap antar pesanan sampai ke alamt tujuan')
	}

	if(findOrder.id_status === 7){
		throw new ErrorResponse(400, 'Pesanan sudah diselesaikan')
	}

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

		await tx.log_order.create({
			data: {
				id: uniqid(),
				id_order: idOrder,
				id_status: 7,
				detail_status: '',
				change_by: 'Courier',
				id_changer: id_courier,
				time: new Date()
			},
			select: {
				id: true
			}
		})

		await tx.order_item.deleteMany({
			where: {
				id_order: idOrder
			}
		})

		await tx.order.delete({
			where: {
				id_courier: id_courier
			}
		})
	})

	// GET STATUS & DATA COURIER FOR UPDATE STATUS ORDER VIA SOCKET
	const getStatusOrder = await prismaClient.status_order.findUnique({
		where: {
			id: 7
		},
		select: {
			id: true,
			name: true
		}
	})

	const result = {
		id_order: idOrder,
		status: {
			id: 7,
			message: getStatusOrder.name
		}
	}

	return result
}

export default {
	get,
	deliver,
	delivered,
	finish
}