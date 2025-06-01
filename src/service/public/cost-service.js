const getSystemCost = async (destination) => {
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

export default {
	getSystemCost
}