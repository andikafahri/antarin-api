import Joi from 'joi'
import {
	usernameSchema,
	passwordSchema,
	confirmPasswordSchema,
	nameSchema,
	emailSchema,
	phoneSchema,
	addressSchema,
	idSubdSchema,
	idCitySchema,
	idProvSchema
} from './schema_validation.js'

const registerMerchantValidation = Joi.object({
	username:usernameSchema.required(),
	password:passwordSchema.required(),
	confirm_password:confirmPasswordSchema.valid(Joi.ref('password')).required(),
	name:nameSchema.required(),
	address: addressSchema.required(),
	id_subd: idSubdSchema.required(),
	id_city: idCitySchema.required(),
	id_prov: idProvSchema.required(),
	email:emailSchema.required(),
	phone:phoneSchema.optional().empty('')
})

const loginMerchantValidation = Joi.object({
	username:usernameSchema.required(),
	password:passwordSchema.required()
})

const getMerchantValidation = Joi.string().max(100).trim().required()

const updateMerchantValidation = Joi.object({
	username:usernameSchema.optional(),
	name:nameSchema.optional(),
	address: addressSchema.optional(),
	id_subd: idSubdSchema.optional(),
	id_city: idCitySchema.optional(),
	id_prov: idProvSchema.optional(),
	email:emailSchema.optional(),
	phone:phoneSchema.optional().allow('')
})

const updatePasswordValidation = Joi.object({
	password_old: passwordSchema.required(),
	password_new: passwordSchema.required(),
	confirm_password_new: confirmPasswordSchema.valid(Joi.ref('password_new')).required()
})

export {
	registerMerchantValidation,
	loginMerchantValidation,
	getMerchantValidation,
	updateMerchantValidation,
	updatePasswordValidation
}