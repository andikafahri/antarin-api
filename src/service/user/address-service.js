import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'
import {getAddressWithCoordinate} from '../../application/geo-json.js'
import uniqid from 'uniqid'
import {validate} from '../../validation/validation.js'
import {
	addAddressValidation,
	getAddressBookmarkedValidation,
	updateAddressValidation,
	deleteAddressValidation
} from '../../validation/user/address-validation.js'

const addAddress = async (id_user, request) => {
	const req = validate(addAddressValidation, request)

	const addressData = await getAddressWithCoordinate(req.coordinate)

	return prismaClient.history_address.create({
		data: {
			id: uniqid(),
			id_user: id_user,
			name: req.name,
			address: req.address,
			id_subd: addressData.id_subd,
			id_city: addressData.id_city,
			id_prov: addressData.id_prov,
			lng: req.coordinate.lng,
			lat: req.coordinate.lat,
			is_bookmark: req.is_bookmark
		}
	})
}

const getAddress = async (id_user) => {
	const data = await prismaClient.history_address.findMany({
		where: {
			id_user: id_user
		},
		select: {
			id: true,
			name: true,
			address: true,
			id_subd: true,
			id_city: true,
			id_prov: true,
			lng: true,
			lat: true,
			is_bookmark: true
		}
	})

	let result = []

	data.map(list => {
		const {lng, lat, ...newData} = list
		result.push({
			...newData,
			coordinate: {
				lng,
				lat
			}
		})
	})

	return result
}

const getAddressBookmarked = async (id_user, id_address) => {
	const filter = validate(getAddressBookmarkedValidation, {id_user, id_address})

	const data = await prismaClient.history_address.findFirst({
		where: {
			id: filter.id_address,
			id_user: filter.id_user,
			is_bookmark: true
		},
		select: {
			id: true,
			name: true,
			address: true,
			lng: true,
			lat: true
		}
	})

	const result = {
		...data,
		coordinate: {
			lng: data.lng,
			lat: data.lat
		}
	}

	delete result.lng
	delete result.lat

	return result
}

const updateAddress = async (id_user, id_address, request) => {
	request.id_user = id_user
	request.id_address = id_address
	const req = validate(updateAddressValidation, request)

	const findAddress = await prismaClient.history_address.findFirst({
		where: {
			id: req.id_address,
			id_user: req.id_user,
			is_bookmark: true
		}
	})

	if(!findAddress){
		new ErrorResponse(404, 'Address not found')
	}

	return prismaClient.history_address.update({
		where: {
			id: req.id_address,
			id_user: req.id_user,
			is_bookmark: true
		},
		data: {
			name: req.name,
			address: req.address,
			lng: req.coordinate.lng,
			lat: req.coordinate.lat
		}
	})
}

const deleteAddress = async (id_user, id_address) => {
	const req = validate(deleteAddressValidation, {id_user, id_address})

	const findAddress = await prismaClient.history_address.findFirst({
		where: {
			id: req.id_address,
			id_user: req.id_user
		}
	})

	if(!findAddress){
		new ErrorResponse(404, 'Address not found')
	}

	return prismaClient.history_address.delete({
		where: {
			id: id_address,
			id_user: id_user
		}
	})
}

const bookmarkAddress = async (id_user, id_address) => {
	const req = validate(deleteAddressValidation, {id_user, id_address})

	const findAddress = await prismaClient.history_address.findFirst({
		where: {
			id: req.id_address,
			id_user: req.id_user
		}
	})

	if(!findAddress){
		new ErrorResponse(404, 'Address not found')
	}

	return prismaClient.history_address.update({
		where: {
			id: id_address,
			id_user: id_user
		},
		data: {
			is_bookmark: true
		}
	})
}

export default {
	addAddress,
	getAddress,
	getAddressBookmarked,
	updateAddress,
	deleteAddress,
	bookmarkAddress
}