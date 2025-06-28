import Joi from 'joi'
import {
	addressSchema,
	idSubdSchema,
	idCitySchema,
	idProvSchema
} from '../schema_validation.js'

const idOrderSchema = Joi.string()
.max(100)
.trim()
.empty('')
.messages({
	'string.base': 'Id Order tidak boleh kosong',
	'string.max': 'Id Order tidak boleh kosong',
	'string.empty': 'Id Order tidak boleh kosong',
	'any.required': 'Id Order tidak boleh kosong'
})

const idMenuSchema = Joi.string()
.max(100)
.trim()
.empty('')
.messages({
	'string.base': 'Menu tidak boleh kosong',
	'string.max': 'Menu tidak boleh kosong',
	'string.empty': 'Menu tidak boleh kosong',
	'any.required': 'Menu tidak boleh kosong'
})

const idVariantSchema = Joi.string()
.max(100)
.trim()
.empty('')
.messages({
	'string.base': 'Varian tidak boleh kosong',
	'string.max': 'Varian tidak boleh kosong',
	'string.empty': 'Varian tidak boleh kosong',
	'any.required': 'Varian tidak boleh kosong'
})

const qtySchema = Joi.number()
.positive()
.messages({
	'number.base': 'Jumlah order/item tidak boleh kosong / harus berupa angka',
	'number.empty': 'Jumlah order/item tidak boleh kosong / harus berupa angka',
	'number.positive': 'Jumlah order/item minimal 1',
	'any.required': 'Jumlah order/item tidak boleh kosong / harus berupa angka'
})

const noteSchema = Joi.string()
.pattern(/^[(?=.*a-zA-Z\d\s.,\-()/|]+$/)
.max(100)
.messages({
	'string.pattern.base': 'Catatan order harus berupa huruf besar, huruf kecil, angka, atau simbol .,-()/|. Diperbolehkan menggunakan spasi',
	'string.min': 'Catatan order maksimal 100 karakter',
	'string.max': 'Catatan order maksimal 100 karakter'
	// 'string.empty': 'Catatan order tidak boleh kosong',
	// 'any.required': 'Catatan order tidak boleh kosong'
})

const idUserSchema = Joi.string()
.max(100)
.trim()
.empty('')
.messages({
	'string.base': 'Id User tidak boleh kosong',
	'string.max': 'Id User tidak boleh kosong',
	'string.empty': 'Id User tidak boleh kosong',
	'any.required': 'Id User tidak boleh kosong'
})

const createOrderValidation = Joi.object({
	destination: addressSchema.required(),
	id_subd: idSubdSchema.required(),
	id_city: idCitySchema.required(),
	id_prov: idProvSchema.required(),
	items: Joi.array().items(
		Joi.object({
			id_menu: idMenuSchema.required(),
			id_variant:idVariantSchema.required(),
			qty: qtySchema.required(),
			note: noteSchema.optional().empty('')
		})
		).min(1).required()
	.messages({
		'array.min': 'Order harus memiliki minimal 1 item',
		'any.required': 'Order tidak boleh kosong'
	})
})

const cancelOrderValidation = idUserSchema.required()

const getOrderValidation = idUserSchema.required()

const confirmValidation = Joi.object({
	items: Joi.array().items(
		Joi.object({
			id: Joi.string().optional().empty('').trim(),
			id_menu: idMenuSchema.optional(),
			id_variant:idVariantSchema.optional(),
			qty: qtySchema.required(),
			note: noteSchema.optional().empty('')
		})
		).min(1).required()
	.messages({
		'array.min': 'Order harus memiliki minimal 1 item',
		'any.required': 'Order tidak boleh kosong'
	})
})

export {
	createOrderValidation,
	cancelOrderValidation,
	getOrderValidation,
	confirmValidation
}