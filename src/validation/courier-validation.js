import Joi from 'joi'
import {
	usernameSchema,
	passwordSchema,
	confirmPasswordSchema,
	nameSchema,
	emailSchema,
	phoneSchema
} from './schema_validation.js'

const numberPlateSchema = Joi.string()
.pattern(/^[A-Z]{1,2}\s?\d{1,4}\s?[A-Z]{0,3}$/)
.max(12)
.messages({
	'string.pattern.base': 'Format plat nomor tidak valid',
	'string.max': 'Plat nomor maksimal 12 karakter',
	'string.empty': 'Plat nomor tidak boleh kosong',
	'any.required': 'Plat nomor tidak boleh kosong'
})

const idBrandSchema = Joi.number()
.min(1)
.max(11)
.positive()
.messages({
	'number.base': 'Brand tidak boleh kosong',
	'number.min': 'Brand tidak boleh kosong',
	'number.max': 'Brand tidak valid',
	'number.empty': 'Brand tidak boleh kosong',
	'any.required': 'Brand tidak boleh kosong'
})

const colorSchema = Joi.string()
.pattern(/^[a-zA-Z][a-zA-Z ]*$/)
.max(20)
.messages({
	'string.pattern.base': 'Warna harus berupa huruf besar dan huruf kecil. Diperbolehkan menggunakan spasi',
	'string.max': 'Warna maksimal 20 karakter',
	'string.empty': 'Warna tidak boleh kosong',
	'any.required': 'Warna tidak boleh kosong'
})

const registerCourierValidation = Joi.object({
	username: usernameSchema.required(),
	password: passwordSchema.required(),
	confirm_password: confirmPasswordSchema.valid(Joi.ref('password')).required(),
	name: nameSchema.required(),
	email: emailSchema.required(),
	phone: phoneSchema.optional().empty(''),
	number_plate: numberPlateSchema.required(),
	id_brand: idBrandSchema.required(),
	color: colorSchema.required()
})

const loginCourierValidation = Joi.object({
	username: usernameSchema.required(),
	password: passwordSchema.required()
})

const getCourierValidation = Joi.string().max(100).required()

const updateCourierValidation = Joi.object({
	username: usernameSchema.optional(),
	name: nameSchema.optional(),
	email: emailSchema.optional(),
	phone: phoneSchema.optional().empty(''),
	number_plate: numberPlateSchema.optional(),
	id_brand: idBrandSchema.optional(),
	color: colorSchema.optional()
})

const updatePasswordValidation = Joi.object({
	password_old: passwordSchema.required(),
	password_new: passwordSchema.required(),
	confirm_password_new: confirmPasswordSchema.valid(Joi.ref('password_new')).required()
})

export {registerCourierValidation, loginCourierValidation, getCourierValidation, updateCourierValidation, updatePasswordValidation}