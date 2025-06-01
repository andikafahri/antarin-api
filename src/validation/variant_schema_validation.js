import Joi from 'joi'

const nameVariantSchema = Joi.string()
.pattern(/^[a-zA-Z\d][a-zA-Z\d\s,\-()/|]*$/)
.max(100)
.messages({
	'string.pattern.base': 'Nama varian harus berupa huruf besar, huruf kecil, angka. Diperbolehkan menggunakan spasi',
	'string.min': 'Nama varian maksimal 100 karakter',
	'string.max': 'Nama varian maksimal 100 karakter',
	'string.empty': 'Nama varian tidak boleh kosong',
	'any.required': 'Nama varian tidak boleh kosong'
})

// const idMenuSchema = Joi.string()
// .max(100)
// .trim()
// .empty('')
// .messages({
// 	'string.base': 'Menu tidak boleh kosong',
// 	'string.max': 'Menu tidak boleh kosong',
// 	'string.empty': 'Menu tidak boleh kosong',
// 	'any.required': 'Menu tidak boleh kosong'
// })

const priceVariantItemSchema = Joi.number()
.min(0)
.precision(2)
.messages({
	'number.base': 'Harga item varian tidak boleh kosong',
	'number.empty': 'Harga item varian tidak boleh kosong',
	'any.required': 'Harga item varian tidak boleh kosong'
})

const createVariantValidation = Joi.object({
	name: nameVariantSchema.required()
})

const createVariantItemValidation = Joi.object({
	name: nameVariantSchema.required(),
	price: priceVariantItemSchema.required()
})

export {
	nameVariantSchema,
	priceVariantItemSchema,
	
	createVariantValidation,
	createVariantItemValidation
}