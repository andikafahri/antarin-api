import {prismaClient} from '../../application/database.js'

const getListOLD = async () => {
	return prismaClient.merchant.findMany()
}

const getList = async (filterQuery) => {

	const allowedQuery = ['search', 'category']
	const query = Object.keys(filterQuery || {})
	const isValidQuery = query.every(key => allowedQuery.includes(key))

	if(!isValidQuery){
		return []
	}

	const filter = {}

	if(filterQuery.search){
		filter.search = filterQuery.search.toLowerCase()
	}

	if(filterQuery.category){
		filter.category = filterQuery.category.toLowerCase()
	}

	// const data = await prismaClient.merchant.findMany({
	// 	where: {
	// 		AND: [
	// 			{
	// 				OR: [
	// 					{
	// 						name: {
	// 							contains: filter.search
	// 						}		
	// 					},
	// 					{
	// 						rel_menu: {
	// 							some: {
	// 								name: {
	// 									contains: filter.search
	// 								}
	// 							}
	// 						}
	// 					}
	// 				],
	// 				rel_menu: {
	// 					some: {
	// 						rel_category: {
	// 							name: filter.category
	// 						}	
	// 					}
	// 				}
	// 			}
	// 		]

	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		address: true,
	// 		is_open: true,
	// 		rel_menu: {
	// 			select: {
	// 				name: true,
	// 				rel_category: {
	// 					select: {
	// 						name: true
	// 					}
	// 				}
	// 			}
	// 		}
	// 	}
	// })


	const data = await prismaClient.menu.findMany({
		where: {
			OR: [
				{
					name: {
						contains: filter.search
					}
				},
				{
					rel_merchant: {
						name: {
							contains: filter.search
						}
					}
				}
			],
			rel_category: {
				name: filter.category
			}
		},
		select: {
			id: true,
			name: true,
			rel_merchant: {
				select: {
					id: true,
					name: true,
					address: true,
					image: true,
					is_open: true
				}
			},
		}
	})

	const groupByMerchant = {}
	for(const menu of data){
		const merchant = menu.rel_merchant
		if(!merchant){
			continue
		}

		const idMerchant = merchant.id
		if(!groupByMerchant[idMerchant]){
			groupByMerchant[idMerchant] = {
				id: merchant.id,
				name: merchant.name,
				address: merchant.address,
				image: merchant.image,
				is_open: merchant.is_open,
				menus: []
			}
		}

		groupByMerchant[idMerchant].menus.push({
			id: menu.id,
			name: menu.name
		})
	}

	return Object.values(groupByMerchant)
}

export default {
	getList
}