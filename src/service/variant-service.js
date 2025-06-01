import {validate} from '../validation/validation.js'
import {
	createVariantValidation,
	createVariantItemValidation
} from '../validation/variant_schema_validation.js'
import {prismaClient} from '../application/database.js'
import {ErrorResponse} from '../application/error-response.js'
import uniqid from 'uniqid'

const checkMenu = async (id_menu, id_merchant) => {
	const result = await prismaClient.menu.findFirst({
		where: {
			id: id_menu,
			id_merchant: id_merchant
		},
		select: {
			name: true
		}
	})

	if(!result){
		throw new ErrorResponse(404, 'Menu not found')
	}

	return result
}

const create = async (id_menu, id_merchant, request) => {
	const req = validate(createVariantValidation, request)

	await checkMenu(id_menu, id_merchant)

	req.id = uniqid()
	req.id_menu = id_menu

	return prismaClient.variant.create({
		data: req,
		select: {
			name: true
		}
	})
}

const createItem = async (id_menu, id_merchant, id_variant, request) => {
	const req = validate(createVariantItemValidation, request)

	await checkVariant(id_menu, id_merchant, id_variant)

	req.id = uniqid()
	req.id_variant = id_variant

	return prismaClient.variant_item.create({
		data: req,
		select: {
			name: true
		}
	})
}

export default {
	create,
	createItem
}