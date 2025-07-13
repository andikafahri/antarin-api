import dotenv from 'dotenv'
import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'

dotenv.config()

const getCoordinateMerchant = async (id_merchant) => {
	return prismaClient.merchant.findUnique({
		where: {
			id: id_merchant
		},
		select: {
			lng: true,
			lat: true
		}
	})
}

const getSystemCost_OLD = async (destination) => {
	const costByDestination = {
		Ngebruk: 3000,
		Senggreng: 5000,
		Sumberpucung: 8000
	}

	const shippingCost = costByDestination[destination] || 0
	const serviceCost = 1000

	const data = {
		shipping_cost: shippingCost,
		service_cost: serviceCost
	}

	return data
}

const getSystemCost = async (id_merchant, destination) => {
	const costUnder1Km = 5000
	const costPerKm = 2000

	// const coordinateMerchant = {
	// 	lat: -8.16917,
	// 	lng: 112.50833
	// }

	const coordinateMerchant = await getCoordinateMerchant(id_merchant)

	console.log('DESTINATION : ')
	console.log(destination)

	// GET DISTANCE FROM OPEN ROUTE SERVICE API
	const resp = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.API_KEY_ORS_MAP}=&start=${coordinateMerchant.lng},${coordinateMerchant.lat}&end=${destination.lng},${destination.lat}`)
	const getDistance = await resp.json()
	const distanceKm = Number(getDistance.features[0].properties.summary.distance) / 1000
	// const distanceKm = 3238 / 1000
	const roundedKm = Math.round(distanceKm*10)/10

	console.log(distanceKm)
	console.log(roundedKm)

	let shippingCost = 0
	if(roundedKm < 2){
		shippingCost = costUnder1Km
	}else{
		const splitDistance = roundedKm.toString().split('.')
		const km = parseInt(splitDistance[0])
		const m = parseInt(splitDistance[1])

		if(m < 3){
			shippingCost = costPerKm * km
		}else if(m >= 3 && m < 7){
			shippingCost = costPerKm * km + (costPerKm / 2)
		}else{
			shippingCost = costPerKm * (km + 1)
		}
	}

	console.log('SHIPPING COST: '+shippingCost)
	const serviceCost = 1000

	const data = {
		shipping_cost: shippingCost,
		service_cost: serviceCost
	}

	return data
}

export default {
	getSystemCost
}