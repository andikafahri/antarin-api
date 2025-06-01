import Joi from 'joi'

const getMenuByMerchantValidation = Joi.string()
.max(100)
.trim()
.empty('')
.required()
.messages({
	'string.base': 'Merchant tidak boleh kosong',
	'string.max': 'Merchant tidak boleh kosong',
	'string.empty': 'Merchant tidak boleh kosong',
	'any.required': 'Merchant tidak boleh kosong'
})

export {
	getMenuByMerchantValidation
}