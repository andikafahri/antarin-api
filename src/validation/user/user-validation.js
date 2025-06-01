import Joi from 'joi'
import {
	usernameSchema,
	passwordSchema,
	confirmPasswordSchema,
	nameSchema,
	emailSchema,
	phoneSchema
} from '../schema_validation.js'

const registerUserValidation = Joi.object({
	username: usernameSchema.required(),
	password: passwordSchema.required(),
	confirm_password: confirmPasswordSchema.valid(Joi.ref('password')).required(),
	name: nameSchema.required(),
	email: emailSchema.required(),
	phone: phoneSchema.optional().empty('')
})

const loginUserValidation = Joi.object({
	username: usernameSchema.required(),
	password: passwordSchema.required()
})

const getUserValidation = Joi.string().max(100).required()

const updateUserValidation = Joi.object({
	username: usernameSchema.optional(),
	name: nameSchema.optional(),
	email: emailSchema.optional(),
	phone: phoneSchema.optional().empty('')
})

const updatePasswordValidation = Joi.object({
	password_old: passwordSchema.required(),
	password_new: passwordSchema.required(),
	confirm_password_new: confirmPasswordSchema.valid(Joi.ref('password_new')).required()
})

export {registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation, updatePasswordValidation}