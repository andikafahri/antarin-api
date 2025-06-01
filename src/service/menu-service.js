import {validate} from '../validation/validation.js'
import {
	// createMenuValidation,
	createMenuWithVariantValidation,
	getListMenuValidation,
	// updateMenuValidation
	updateMenuWithVariantValidation
} from '../validation/menu-validation.js'
import {prismaClient} from '../application/database.js'
import {ErrorResponse} from '../application/error-response.js'
import uniqid from 'uniqid'
import {logger} from '../application/logger.js'

const checkMenu = async (id, id_merchant) => {
	const result = await prismaClient.menu.findFirst({
		where: {
			id: id,
			id_merchant: id_merchant
		},
		select: {
			name: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Menu not found')
	}
}

const checkCategory = async (id_category) => {
	const result = await prismaClient.category.findUnique({
		where: {
			id: id_category
		},
		select: {
			name: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Kategori not found')
	}
}

const checkVariant = async (id_variant, id_menu) => {
	const result = await prismaClient.variant.findFirst({
		where: {
			id: id_variant,
			id_menu: id_menu
		},
		select: {
			name: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Variant not found')
	}
}

const checkVariantItem = async (id_item, id_variant) => {
	const result = await prismaClient.variant_item.findFirst({
		where: {
			id: id_item,
			id_variant: id_variant
		},
		select: {
			name: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Item varian not found')
	}
}

const createMenuwithVariant = async (id_merchant, request) => {
	const req = validate(createMenuWithVariantValidation, request)

	await checkCategory(req.id_category)

	const idMenu = uniqid()

	const result = await prismaClient.$transaction(async (tx) => {
		await tx.menu.create({
			data: {
				id: idMenu,
				name: req.name,
				detail: req.detail,
				id_category: req.id_category,
				price: req.price,
				is_ready: req.is_ready,
				id_merchant: id_merchant
			},
			select: {
				name: true
			}
		})

		for (const variant of req.variants) {
			const idVariant = uniqid()

			await tx.variant.create({
				data: {
					id: idVariant,
					name: variant.name,
					id_menu: idMenu
				},
				select: {
					name: true
				}
			})

			const itemData = variant.items.map((item) => ({
				id: uniqid(),
				name: item.name,
				id_variant: idVariant,
				price: item.price
			}))

			await tx.variant_item.createMany({
				data: itemData
			})
		}
	})

	console.log(result)
	return result
}

const getList = async (id_merchant) => {
	id_merchant = validate(getListMenuValidation, id_merchant)

	const data = await prismaClient.menu.findMany({
		where: {
			id_merchant: id_merchant
		},
		select: {
			id: true,
			name: true,
			rel_category: {
				select: {
					name: true
				}
			},
			// id_category: true,
			price: true,
			is_ready: true
		}
	})

	if(!data){
		throw new ErrorResponse(404, 'Merchant not found')
	}

	const list = data.map(item => {
		const newItem = {
			...item,
			category: item.rel_category?.name || null
		}
		delete newItem.rel_category
		return newItem
	})

	// const list = data.map(item => ({
	// 	id: item.id,
	// 	name: item.name,
	// 	price: item.price,
	// 	category: item.rel_category,
	// 	is_ready: item.is_ready
	// }))

	return list
}

const getCurrentWithVariant = async (id, id_merchant) => {
	const data = await prismaClient.menu.findFirst({
		where: {
			id: id,
			id_merchant: id_merchant
		},
		select: {
			name: true,
			detail: true,
			id_category: true,
			price: true,
			is_ready: true,
			rel_variant: {
				select: {
					id: true,
					name: true,
					rel_variant_item: {
						select: {
							id: true,
							name: true,
							price: true
						}
					}
				}
			}
		}
	})

	if(!data){
		throw new ErrorResponse(404, 'Menu not found')
	}

	const result = {
		...data,
		variants: (data.rel_variant || []).map(variant => ({
			id: variant.id,
			name: variant.name,
			items: variant.rel_variant_item
		}))
	}
	delete result.rel_variant
	delete result.rel_variant_item

	return result
}

const updateWithVariant = async (id, id_merchant, request) => {
	const req = validate(updateMenuWithVariantValidation, request)

	await checkMenu(id, id_merchant)
	await checkCategory(req.id_category)

	const reqVariant = req.variants

	const result = await prismaClient.$transaction(async (tx) => {
		await tx.menu.update({
			where: {
				id: id,
				id_merchant: id_merchant
			},
			data: {
				name: req.name,
				detail: req.detail,
				id_category: req.id_category,
				price: req.price,
				is_ready: req.is_ready,
				update_at: new Date()
			},
			select: {
				name: true
			}
		})

		const findVariant = await tx.variant.findMany({
			where: {
				id_menu: id
			},
			select: {
				id: true
			}
		})
		const variantInDb = findVariant.map(v => v.id)
		const incomingVariant = reqVariant.filter(v => v.id).map(v => v.id)
		const deleteVariant = variantInDb.filter(id_variant => !incomingVariant.includes(id_variant))
		if(deleteVariant.length > 0){
			await tx.variant.deleteMany({
				where: {
					id: {
						in: deleteVariant
					},
					id_menu: id
				}
			})
		}

		for(const variant of reqVariant){
			if(!variant.id){
				await tx.variant.create({
					data: {
						id: uniqid(),
						name: variant.name,
						id_menu: id,
						rel_variant_item: {
							create: variant.items.map(item => ({
								id: uniqid(),
								name: item.name,
								price: item.price
							}))
						}
					}
				})
			}else{
				await checkVariant(variant.id, id)
				await tx.variant.update({
					where: {
						id: variant.id,
						id_menu: id
					},
					data: {
						name: variant.name,
						update_at: new Date()
					}
				})

				await Promise.all(
					variant.items.filter(i => i.id).map(async i => {
						await checkVariantItem(i.id, variant.id)
						return tx.variant_item.update({
							where: {
								id: i.id,
								id_variant: variant.id
							},
							data: {
								name: i.name,
								price: i.price,
								update_at: new Date()
							}
						})
					})
					)

				const findItem = await tx.variant_item.findMany({
					where: {
						id_variant: variant.id
					},
					select: {
						id: true
					}
				})
				const itemInDb = findItem.map(i => i.id)
				const incomingItem = variant.items.filter(i => i.id).map(i => i.id)
				const deleteItem = itemInDb.filter(id_item => !incomingItem.includes(id_item))
				if(deleteItem.length > 0){	
					await tx.variant_item.deleteMany({
						where: {
							id: {
								in: deleteItem
							}
						}
					})
				}

				await tx.variant_item.createMany({
					data: variant.items.filter(i => !i.id).map(i => ({
						id: uniqid(),
						name: i.name,
						price: i.price,
						id_variant: variant.id
					}))
				})
			}
		}
	})

	return result
}

const remove = async (id, id_merchant) => {
	await checkMenu(id, id_merchant)

	return prismaClient.menu.delete({
		where: {
			id: id
		}
	})
}

export default {
	createMenuwithVariant,
	getList,
	getCurrentWithVariant,
	updateWithVariant,
	remove
}