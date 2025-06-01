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
			// id_status: 5
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
		throw new ErrorResponse(404, 'Order sudah dalam proses pengantaran')
	}

	return prismaClient.$transaction(async (tx) => {
		const update = await tx.order.updateMany({
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
}

const finish = async (id_courier) => {
	await checkCourier(id_courier)

	const findOrder = await prismaClient.order.findFirst({
		where: {
			id_courier: id_courier,
			// id_status: 6
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

	if(findOrder.id_status === 7){
		throw new ErrorResponse(404, 'Pesanan sudah diselesaikan')
	}

	return prismaClient.$transaction(async (tx) => {
		await tx.order.update({
			where: {
				id: findOrder.id,
				id_status: 6
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
}

export default {
	get,
	deliver,
	finish
}