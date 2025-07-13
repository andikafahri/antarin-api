import Joi from 'joi'
import {
	addressSchema
} from '../schema_validation.js'

const nameSchema = Joi.string()
.pattern(/^[(?=.*a-zA-Z\d\s.,\-()/|]+$/)
.max(50)
.messages({
	'string.pattern.base': 'Nama bookmark hanya boleh berupa huruf besar, huruf kecil, angka, atau simbol .,-()/|.',
	'string.min': 'Nama bookmark maksimal 50 karakter',
	'string.max': 'Nama bookmark maksimal 50 karakter'
})

const latCoordinateSchema = Joi.number()
.min(-90)
.max(90)
.required()
.messages({
	'number.base': 'Latitude harus berupa angka',
	'number.min': 'Latitude minimal -90',
	'number.max': 'Latitude maksimal 90',
	'any.required': 'Titik alamat wajib diisi',
})

const lngCoordinateSchema = Joi.number()
.min(-180)
.max(180)
.required()
.messages({
	'number.base': 'Longitude harus berupa angka',
	'number.min': 'Longitude minimal -180',
	'number.max': 'Longitude maksimal 180',
	'any.required': 'Titik alamat wajib diisi',
})

const idSchema = Joi.string()
.max(100)
.trim()
.empty('')
.messages({
	'string.base': 'Id tidak boleh kosong',
	'string.max': 'Id tidak boleh kosong',
	'string.empty': 'Id tidak boleh kosong',
	'any.required': 'Id tidak boleh kosong'
})

const addAddressValidation = Joi.object({
	name: nameSchema.optional().allow(''),
	coordinate: Joi.object({
		lat: latCoordinateSchema.required(),
		lng: lngCoordinateSchema.required()
	}),
	address: addressSchema.required(),
	is_bookmark: Joi.boolean().optional()
})

const getAddressBookmarkedValidation = Joi.object({
	id_user: idSchema.required(),
	id_address: idSchema.required()
})

const updateAddressValidation = Joi.object({
	id_user: idSchema.required(),
	id_address: idSchema.required(),

	name: nameSchema.optional().allow(''),
	coordinate: Joi.object({
		lat: latCoordinateSchema.required(),
		lng: lngCoordinateSchema.required()
	}),
	address: addressSchema.required()
})

const deleteAddressValidation = Joi.object({
	id_user: idSchema.required(),
	id_address: idSchema.required()
})

export {
	addAddressValidation,
	getAddressBookmarkedValidation,
	updateAddressValidation,
	deleteAddressValidation
}