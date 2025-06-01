import Joi from 'joi'

const usernameSchema = Joi.string()
.pattern(/^[a-z][a-z0-9_]*$/)
.min(5)
.max(25)
.messages({
	'string.pattern.base': 'Username harus berupa huruf kecil, angka, atau simbol _ tanpa spasi dan diawali dengan huruf kecil',
	'string.min': 'Username harus 5-25 karakter',
	'string.max': 'Username harus 5-25 karakter',
	'string.empty': 'Username tidak boleh kosong',
	'any.required': 'Username tidak boleh kosong'
})

const passwordSchema = Joi.string()
.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=]+$/)
.min(8)
.max(15)
.messages({
	'string.pattern.base': 'Password harus berupa huruf kecil, huruf besar, angka, dan tanpa spasi. Diperbolehkan menggunakan simbol !@#$%^&*()_+-=',
	'string.min': 'Password harus 8-15 karakter',
	'string.max': 'Password harus 8-15 karakter',
	'string.empty': 'Password tidak boleh kosong',
	'any.required': 'Password tidak boleh kosong'
})

const confirmPasswordSchema = Joi.string()
.messages({
	'any.only': 'Konfirmasi password tidak cocok',
	'string.empty': 'Konfirmasi password tidak boleh kosong',
	'any.required': 'Konfirmasi password tidak boleh kosong'
})

const nameSchema = Joi.string()
.pattern(/^[a-zA-Z ]+$/)
.trim()
.empty('')
.max(35)
.messages({
	'string.pattern.base': 'Nama harus berupa huruf besar dan huruf kecil. Diperbolehkan menggunakan spasi',
	'string.min': 'Nama maksimal 35 karakter',
	'string.max': 'Nama maksimal 35 karakter',
	'string.empty': 'Nama tidak boleh kosong',
	'any.required': 'Nama tidak boleh kosong'
})

const emailSchema = Joi.string()
// .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
.email()
.max(70)
.messages({
	// 'string.pattern.base': 'Format email tidak valid',
	'string.email': 'Format email tidak valid',
	'string.min': 'Email maksimal 70 karakter',
	'string.max': 'Email maksimal 70 karakter',
	'string.empty': 'Email tidak boleh kosong',
	'any.required': 'Email tidak boleh kosong'
})

const phoneSchema = Joi.string()
// .pattern(/^(\+62|62|0)8[1-9][0-9]{6,9}$/)
.pattern(/^(\+62|62|0)8[1-9][0-9]{9,10}$/)
// .min(12)
// .max(13)
.messages({
	'string.pattern.base': 'Format telepon tidak valid'
	// 'string.min': 'No telepon harus 12-13 karakter',
	// 'string.max': 'No telepon harus 12-13 karakter'
})

const registerUserValidation = Joi.object({
	username: usernameSchema.required(),
	password: passwordSchema.required(),
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