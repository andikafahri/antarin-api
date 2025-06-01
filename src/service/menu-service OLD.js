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

// const create = async (id_merchant, request) => {
// 	const req = validate(createMenuValidation, request)

// 	await checkCategory(req.id_category)

// 	req.id = uniqid()
// 	req.id_merchant = id_merchant

// 	return prismaClient.menu.create({
// 		data: req,
// 		select: {
// 			name: true
// 		}
// 	})
// }

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

// const getCurrent = async (id, id_merchant) => {
// 	await checkMenu(id, id_merchant)

// 	return prismaClient.menu.findUnique({
// 		where: {
// 			id: id
// 		},
// 		select: {
// 			name: true,
// 			detail: true,
// 			id_category: true,
// 			price: true,
// 			is_ready: true
// 		}
// 	})
// }

const getCurrentWithVariant = async (id, id_merchant) => {
	// await checkMenu(id, id_merchant)

	const data = await prismaClient.menu.findUnique({
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

const update = async (id, id_merchant, request) => {
	const req = validate(updateMenuValidation, request)

	await checkMenu(id, id_merchant)
	await checkCategory(req.id_category)

	const data = {}

	data.update_at = new Date()

	if(req.name){
		data.name = req.name
	}

	if(req.detail){
		data.detail = req.detail
	}

	if(req.id_category){
		data.id_category = req.id_category
	}

	if(req.price){
		data.price = req.price
	}

	if(req.is_ready){
		data.is_ready = req.is_ready
	}

	return prismaClient.menu.update({
		where: {
			id: id
		},
		data: data,
		select: {
			name: true
		}
	})
}

// const updateWithVariant = async (id, id_merchant, request) => {
// 	const req = validate(updateMenuWithVariantValidation, request)

// 	await checkMenu(id, id_merchant)
// 	await checkCategory(req.id_category)

// 	const reqVariant = req.variants
// 	const reqVariantItem = req.variants.items

// 	return prismaClient.$transaction(async (tx) => {
// 	// CREATE NEW VARIANT
// 		const newVariant = reqVariant.filter(v => !v.id)
// 		await prismaClient.variant.createMany({
// 			data: newVariant.map(v => ({
// 				name: v.name,
// 				id_menu: id
// 			})),
// 			select: {
// 				name: true
// 			}
// 		})

// 	// UPDATE VARIANT
// 		const updateVariant = reqVariant.filter(v => v.id)
// 		await Promise.all(
// 			updateVariant.map(v => prismaClient.variant.update({
// 				where: {
// 					id: v.id
// 				},
// 				data: {
// 					name: v.name
// 				},
// 				select: {
// 					name: true
// 				}
// 			}))
// 			)

// 	// DELETE VARIANT
// 		const variantInDatabase = await prismaClient.variant.findMany({
// 			where: {
// 				id_menu: id
// 			},
// 			select: {
// 				id: true
// 			}
// 		})
// 		const remainingVariant = updateVariant.map(v => v.id)
// 		const deleteVariant = variantInDatabase.filter(ev => !remainingVariant.includes(ev.id))

// 		await prismaClient.variant.deleteMany({
// 			where: {
// 				id: {
// 					in: deleteVariant.map(v => v.id)
// 				}
// 			}
// 		})

// 	// CREATE NEW VARIANT ITEM
// 		const newVariantItem = reqVariantItem.filter(v => !v.id)
// 		await prismaClient.variant_item.createMany({
// 			data: {
// 				newVariantItem.map(v => ({
// 					name: v.name,
// 					id_variant: id
// 				}))
// 			},
// 			select: {
// 				name: true
// 			}
// 		})

// 	// UPDATE VARIANT ITEM
// 		const updateVariant = reqVariantItem.filter(v => v.id)
// 		await Promise.all(
// 			updateVariant.map(v => prismaClient.variant.update({
// 				where: {
// 					id: v.id
// 				},
// 				data: {
// 					name: v.name
// 				},
// 				select: {
// 					name: true
// 				}
// 			}))
// 			)

// 	// DELETE VARIANT ITEM
// 		const variantInDatabase = await prismaClient.variant.findMany({
// 			where: {
// 				id_menu: id
// 			},
// 			select: {
// 				id: true
// 			}
// 		})
// 		const remainingVariant = updateVariant.map(v => v.id)
// 		const deleteVariant = variantInDatabase.filter(ev => !remainingVariant.includes(ev.id))

// 		await prismaClient.variant.deleteMany({
// 			where: {
// 				id: {
// 					in: deleteVariant.map(v => v.id)
// 				}
// 			}
// 		})
// 	})
// }

const updateWithVariantORI = async (id, id_merchant, request) => {
	const incomingVariants = data.variants;

	for (const variant of incomingVariants) {
		if (!variant.id) {
    // Create variant + items
			const createdVariant = await prisma.variant.create({
				data: {
					name: variant.name,
					menuId,
					items: {
						create: variant.items.map(item => ({
							name: item.name,
							price: parseInt(item.price),
						}))
					}
				}
			});
		} else {
    // Update variant
			await prisma.variant.update({
				where: { id: variant.id },
				data: {
					name: variant.name,
				}
			});

    // Ambil item lama dari DB untuk variant ini
			const existingItems = existingVariants.find(v => v.id === variant.id)?.items ?? [];

			const incomingItemIds = variant.items.filter(i => i.id).map(i => i.id);

    // Update item
			await Promise.all(
				variant.items.filter(i => i.id).map(item =>
					prisma.variantItem.update({
						where: { id: item.id },
						data: {
							name: item.name,
							price: parseInt(item.price),
						}
					})
					)
				);

    // Create item baru
			await prisma.variantItem.createMany({
				data: variant.items
				.filter(item => !item.id)
				.map(item => ({
					name: item.name,
					price: parseInt(item.price),
					variantId: variant.id,
				})),
			});

    // Delete item yang dihapus user
			const toDeleteItemIds = existingItems
			.filter(ei => !incomingItemIds.includes(ei.id))
			.map(ei => ei.id);

			if (toDeleteItemIds.length > 0) {
				await prisma.variantItem.deleteMany({
					where: { id: { in: toDeleteItemIds } },
				});
			}
		}
	}
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
	// create,
	createMenuwithVariant,
	getList,
	// getCurrent,
	getCurrentWithVariant,
	update,
	updateWithVariant,
	remove
}