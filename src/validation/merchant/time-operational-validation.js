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

const daySchema = Joi.number()
.positive()
.min(1)
.max(7)
.messages({
	'number.base': 'Hari tidak boleh kosong / tidak valid',
	'number.min': 'Hari tidak valid',
	'number.max': 'Hari tidak valid',
	'number.empty': 'Hari tidak boleh kosong / tidak valid',
	'any.required': 'Hari tidak boleh kosong / tidak valid'
})

const timeSchema = Joi.string()
.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
.max(5)
.messages({
	'string.pattern.base': 'Waktu harus dalam format HH:mm',
	'string.max': 'Waktu harus dalam format HH:mm',
	'string.empty': 'Waktu tidak boleh kosong',
	'any.required': 'Waktu tidak boleh kosong'
})

const addAndUpdateValidation = Joi.object({
	day: daySchema.required(),
	start_time: timeSchema.required(),
	end_time: timeSchema.required()
})

export {
	addAndUpdateValidation
}
