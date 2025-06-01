import {validate} from '../../validation/validation.js'
import {
	getMenuByMerchantValidation
} from '../../validation/public/menu-validation.js'
import {prismaClient} from '../../application/database.js'

const getMenuByMerchantOLD = async(id_merchant) => {
	id_merchant = validate(getMenuByMerchantValidation, id_merchant)

	return prismaClient.menu.findMany({
		where: {
			id_merchant: id_merchant
		}
	})
}

const getMenuByMerchantOLD2 = async(id_merchant, filter) => {
	id_merchant = validate(getMenuByMerchantValidation, id_merchant)

	// const data = await prismaClient.menu.findMany({
	// 	where: {
	// 		id_merchant: id_merchant
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		price: true,
	// 		is_ready: true,
	// 		rel_merchant: {
	// 			select: {
	// 				id: true,
	// 				name: true,
	// 				address: true,
	// 				is_open: true
	// 			}
	// 		},
	// 		rel_category: {
	// 			select: {
	// 				id: true,
	// 				name: true
	// 			}
	// 		}
	// 	}
	// })


	const allowedQuery = ['name', 'category']
	const query = Object.keys(filter || {})
	const isValidQuery = query.every(key => allowedQuery.includes(key))
	if(!isValidQuery){
		return []
	}

	const whereFilter = {}
	const {name, category} = filter
	if(name){
		whereFilter.name = name
	}
	if(category){
		whereFilter.category = category
	}

	const data = await prismaClient.merchant.findFirst({
		where: {
			id: id_merchant
			// rel_menu: {
			// 	some: {
			// 		rel_category: {
			// 			name: 'Makanan'
			// 		}
			// 	}
			// }
		},
		select: {
			id: true,
			name: true,
			address: true,
			is_open: true,
			rel_menu: {
				where: {
					name: whereFilter.name,
					rel_category: {
						name: whereFilter.category
					}
				},
				select: {
					id: true,
					name: true,
					price: true,
					is_ready: true,
					rel_category: {
						select: {
							id: true,
							name: true
						}
					}
				}
			}
		}
	})

	const groupByCategory = {}
	for(const menu of data.rel_menu){
		const category = menu.rel_category
		if(!menu.rel_category){
			continue
		}

		const idCategory = category.id
		if(!groupByCategory[idCategory]){
			groupByCategory[idCategory] = {
				id: idCategory,
				name: category.name,
				menus: []
			}
		}

		groupByCategory[idCategory].menus.push({
			id: menu.id,
			name: menu.name,
			price: menu.price,
			is_ready: menu.is_ready
		})
	}

	const result = {
		id: data.id,
		name: data.name,
		address: data.address,
		is_open: data.is_open,
		category: Object.values(groupByCategory)
	}

	return result
}

const getCurrentMerchant = async(id_merchant) => {
	id_merchant = validate(getMenuByMerchantValidation, id_merchant)

	const data = await prismaClient.merchant.findFirst({
		where: {
			id: id_merchant
		},
		select: {
			id: true,
			name: true,
			address: true,
			is_open: true,
			rel_menu: {
				select: {
					rel_category: {
						select: {
							id: true,
							name: true
						}
					}
				}
			}
		}
	})

	const groupCategory = Array.from(
		new Map(
			data.rel_menu.filter(m => m.rel_category).map(m => [m.rel_category.id, m.rel_category])
			).values()
		)

	const result = {
		...data,
		// categorys: data.rel_menu.map(item => ({
		// 	id: item.rel_category.id,
		// 	name: item.rel_category.name
		// }))
		categorys: groupCategory
	}

	delete result.rel_menu

	return result
}

const getMenuByMerchant = async(id_merchant, filter) => {
	id_merchant = validate(getMenuByMerchantValidation, id_merchant)

	const allowedQuery = ['search', 'category']
	const query = Object.keys(filter || {})
	const isValidQuery = query.every(key => allowedQuery.includes(key))
	if(!isValidQuery){
		return []
	}

	const whereFilter = {}
	const {search, category} = filter
	if(search){
		whereFilter.search = search.toLowerCase()
	}
	if(category){
		whereFilter.category = category.toLowerCase()
	}

	const data = await prismaClient.menu.findMany({
		where: {
			id_merchant: id_merchant,
			name: {
				contains: whereFilter.search
			},
			rel_category: {
				name: {
					equals: whereFilter.category
				}
			}
		},
		select: {
			id: true,
			name: true,
			price: true,
			is_ready: true,
			rel_category: {
				select: {
					id: true,
					name: true
				}
			},
			rel_variant: {
				select: {
					name: true,
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

	const groupByCategory = {}
	// for(const menu of data){
	// 	const category = menu.rel_category
	// 	if(!category){
	// 		continue
	// 	}

	// 	const idCategory = category.id
	// 	if(!groupByCategory[idCategory]){
	// 		groupByCategory[idCategory] = {
	// 			id: idCategory,
	// 			name: category.name,
	// 			menus: []
	// 		}
	// 	}

	// 	groupByCategory[idCategory].menus.push({
	// 		id: menu.id,
	// 		name: menu.name,
	// 		price: menu.price,
	// 		is_ready: menu.is_ready
	// 	})
	// }

	for(const menu of data){
		const category = menu.rel_category
		if(!category){
			continue
		}

		const idCategory = category.id
		if(!groupByCategory[idCategory]){
			groupByCategory[idCategory] = {
				id: idCategory,
				name: category.name,
				menus: {}
			}
		}

		groupByCategory[idCategory].menus[menu.id] = {
			id: menu.id,
			name: menu.name,
			price: menu.price,
			is_ready: menu.is_ready,
			variants: {}
		}

		for(const variant of menu.rel_variant){
			groupByCategory[idCategory].menus[menu.id].variants[variant.name] = {
				name: variant.name,
				items: []
			}

			for(const item of variant.rel_variant_item){
				groupByCategory[idCategory].menus[menu.id].variants[variant.name].items.push({
					id: item.id,
					name: item.name,
					price: item.price,
					is_ready: item.is_ready
				})
			}
		}
	}

	return Object.values(groupByCategory)
}

export default {
	getCurrentMerchant,
	getMenuByMerchant
}