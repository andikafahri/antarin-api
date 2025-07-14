import dotenv from 'dotenv'
import {prismaClient} from '../../application/database.js'

dotenv.config()

const getDistance = async (coordinateMerchant, coordinateDestination) => {
	// GET DISTANCE FROM OPEN ROUTE SERVICE API
	const resp = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.API_KEY_ORS_MAP}=&start=${coordinateMerchant.lng},${coordinateMerchant.lat}&end=${coordinateDestination.lng},${coordinateDestination.lat}`)
	const getDistance = await resp.json()
	const distanceKm = Number(getDistance.features[0].properties.summary.distance) / 1000
	const roundedKm = Math.round(distanceKm*10)/10

	return roundedKm
}

const getListOLD = async () => {
	return prismaClient.merchant.findMany()
}

const getList = async (filterQuery) => {
	const allowedQuery = ['search', 'category', 'lng', 'lat']
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

	if(filterQuery.lng){
		filter.lng = parseFloat(filterQuery.lng)
	}

	if(filterQuery.lat){
		filter.lat = parseFloat(filterQuery.lat)
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
					lng: true,
					lat: true,
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

		// let distance
		// if(filterQuery.lng && filterQuery.lat){
		// 	const coordinateMerchant = {
		// 		lng: merchant.lng,
		// 		lat: merchant.lat
		// 	}
		// 	const coordinateDestination = {
		// 		lng: filterQuery.lng,
		// 		lat: filterQuery.lat
		// 	}
		// 	distance = await getDistance(coordinateMerchant, coordinateDestination)
		// }else{
		// 	distance = ''
		// }

		const idMerchant = merchant.id

		if(!groupByMerchant[idMerchant]){
			groupByMerchant[idMerchant] = {
				id: merchant.id,
				name: merchant.name,
				address: merchant.address,
				image: merchant.image,
				is_open: merchant.is_open,
				// distance: distance,
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