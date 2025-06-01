import Joi from 'joi'

const idMerchantSchema = Joi.string()
.max(100)
.trim()
.empty('')
.messages({
	'string.base': 'Id Merchant tidak boleh kosong',
	'string.max': 'Id Merchant tidak boleh kosong',
	'string.empty': 'Id Merchant tidak boleh kosong',
	'any.required': 'Id Merchant tidak boleh kosong'
})

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

const idStatusSchema = Joi.number()
.positive()
.messages({
	'number.base': 'Status tidak boleh kosong / harus berupa angka',
	'number.empty': 'Status tidak boleh kosong / harus berupa angka',
	'any.required': 'Status tidak boleh kosong / harus berupa angka'
})

const idSchema = Joi.string()
.max(100)
.trim()
.empty('')
.messages({
	'string.base': 'Id item tidak boleh kosong',
	'string.max': 'Id item tidak boleh kosong',
	'string.empty': 'Id item tidak boleh kosong',
	'any.required': 'Id item tidak boleh kosong'
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

const noteUnavailableSchema = Joi.string()
.pattern(/^[(?=.*a-zA-Z\d\s.,\-()/|]+$/)
.max(100)
.messages({
	'string.pattern.base': 'Catatan harus berupa huruf besar, huruf kecil, angka, atau simbol .,-()/|. Diperbolehkan menggunakan spasi',
	'string.min': 'Catatan maksimal 200 karakter',
	'string.max': 'Catatan maksimal 200 karakter'
})

const getOrderValidation = Joi.object({
	id_merchant: idMerchantSchema.required(),
	id_status: idStatusSchema.optional().empty('')
})

const decisionValidation = Joi.object({
	filter: Joi.object({
		id_order: idOrderSchema.required(),
		id_merchant: idMerchantSchema.required()
	}),
	body: Joi.object().max(0)
})

const unavailableValidation = Joi.object({
	// id_order: idOrderSchema.required(),
	// id_merchant: idMerchantSchema.required(),
	items: Joi.array().items(
		Joi.object({
			id_item: idSchema.required(),
			unavailable: Joi.string().pattern(/^(?=.*[a-z]).+$/).max(20).required(),
			available_qty: qtySchema.optional().empty(''),
			// condition: Joi.string().pattern(/^(?=.*[a-z\d]).+$/).max(10).required(),
			note: noteUnavailableSchema.optional().empty('')
		})
		).min(1).required()
	.messages({
		'array.min': 'Menu yang tidak tersedia harus memiliki minimal 1 item',
		'any.required': 'Menu tidak boleh kosong'
	})
})

export {
	getOrderValidation,
	decisionValidation,
	unavailableValidation
}