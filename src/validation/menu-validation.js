import Joi from 'joi'
import {
	nameVariantSchema,
	priceVariantItemSchema
} from './variant_schema_validation.js'

const nameSchema = Joi.string()
.pattern(/^[a-zA-Z\d][a-zA-Z\d\s,\-()/|]*$/)
.max(100)
.messages({
	'string.pattern.base': 'Nama menu harus berupa huruf besar, huruf kecil, angka, atau simbol ,-()/|. Diperbolehkan menggunakan spasi',
	'string.min': 'Nama menu maksimal 100 karakter',
	'string.max': 'Nama menu maksimal 100 karakter',
	'string.empty': 'Nama menu tidak boleh kosong',
	'any.required': 'Nama menu tidak boleh kosong'
})

const detailSchema = Joi.string()
.pattern(/^[(?=.*a-zA-Z\d\s.,\-()/|]+$/)
.max(300)
.messages({
	'string.pattern.base': 'Detail menu harus berupa huruf besar, huruf kecil, angka, atau simbol .,-()/|. Diperbolehkan menggunakan spasi',
	'string.min': 'Detail menu maksimal 300 karakter',
	'string.max': 'Detail menu maksimal 300 karakter'
	// 'string.empty': 'Detail menu tidak boleh kosong',
	// 'any.required': 'Detail menu tidak boleh kosong'
})

const idMerchantSchema = Joi.string()
.max(100)
.trim()
.empty('')
.messages({
	'string.base': 'Merchant tidak boleh kosong',
	'string.max': 'Merchant tidak boleh kosong',
	'string.empty': 'Merchant tidak boleh kosong',
	'any.required': 'Merchant tidak boleh kosong'
})

const idCategorySchema = Joi.number()
.positive()
.messages({
	'number.base': 'Kategori tidak boleh kosong',
	'number.empty': 'Kategori tidak boleh kosong',
	'any.required': 'Kategori tidak boleh kosong'
})

const priceSchema = Joi.number()
.positive()
.precision(2)
.messages({
	'number.base': 'Harga tidak boleh kosong',
	'number.empty': 'Harga tidak boleh kosong',
	'any.required': 'Harga tidak boleh kosong'
})

const isReadySchema = Joi.boolean()
.messages({
	'boolean.base': 'Status tersedia tidak boleh kosong',
	'boolean.empty': 'Status tersedia tidak boleh kosong',
	'any.required': 'Status tersedia tidak boleh kosong'
})

// const createMenuValidation = Joi.object({
// 	name: nameSchema.required(),
// 	detail: detailSchema.optional().empty(''),
// 	id_category: idCategorySchema.required(),
// 	price: priceSchema.required(),
// 	is_ready: isReadySchema.required()
// })

const createMenuWithVariantValidation = Joi.object({
	name: nameSchema.required(),
	// detail: detailSchema.optional().empty(''),
	detail: detailSchema.optional().allow('', null).default(''),
	id_category: idCategorySchema.required(),
	price: priceSchema.required(),
	is_ready: isReadySchema.required(),
	variants: Joi.array().items(
		Joi.object({
			name: nameVariantSchema.required(),
			items: Joi.array().items(
				Joi.object({
					name: nameVariantSchema.required(),
					price: priceVariantItemSchema.required(),
					is_ready: isReadySchema.required()
				})
				// ).min(1).optional().default([])
				).min(2).required()
			.messages({
				'array.min': 'Varian harus memiliki minimal 2 item',
				'any.required': 'Item varian tidak boleh kosong'
			})
		})
		).optional()
	.max(1)
	.default([])
	.messages({
		'array.max': 'Kategori varian maksimal 1'
	})
})

const getListMenuValidation = Joi.string().max(100).required()

// const updateMenuValidation = Joi.object({
// 	name: nameSchema.optional(),
// 	detail: detailSchema.optional().empty(''),
// 	id_category: idCategorySchema.optional(),
// 	price: priceSchema.optional(),
// 	is_ready: isReadySchema.optional()
// })

const updateMenuWithVariantValidation = Joi.object({
	name: nameSchema.required(),
	// detail: detailSchema.optional().empty(''),
	detail: detailSchema.optional().allow('', null).default(''),
	id_category: idCategorySchema.required(),
	price: priceSchema.required(),
	is_ready: isReadySchema.required(),
	variants: Joi.array().items(
		Joi.object({
			id: Joi.string().max(100).trim().optional(),
			name: nameVariantSchema.required(),
			items: Joi.array().items(
				Joi.object({
					id: Joi.string().max(100).optional().empty('').trim(),
					name: nameVariantSchema.required(),
					price: priceVariantItemSchema.required(),
					is_ready: isReadySchema.required()
				})
				)
			.min(2)
			.required()
			.messages({
				'array.min': 'Varian harus memiliki minimal 2 item',
				'any.required': 'Item varian tidak boleh kosong'
			})
		})
		).optional()
	.max(1)
	.messages({
		'array.max': 'Kategori varian maksimal 1'
	})
})

export {
	// createMenuValidation,
	createMenuWithVariantValidation,
	getListMenuValidation,
	// updateMenuValidation,
	updateMenuWithVariantValidation
}