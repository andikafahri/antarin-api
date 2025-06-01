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
.pattern(/^[a-zA-Z][a-zA-Z ]*$/)
.max(35)
.messages({
	'string.pattern.base': 'Nama harus berupa huruf besar dan huruf kecil. Diperbolehkan menggunakan spasi',
	'string.min': 'Nama maksimal 35 karakter',
	'string.max': 'Nama maksimal 35 karakter',
	'string.empty': 'Nama tidak boleh kosong',
	'any.required': 'Nama tidak boleh kosong'
})

const emailSchema = Joi.string()
.email()
.max(50)
.messages({
	'string.email': 'Format email tidak valid',
	'string.min': 'Email maksimal 50 karakter',
	'string.max': 'Email maksimal 50 karakter',
	'string.empty': 'Email tidak boleh kosong',
	'any.required': 'Email tidak boleh kosong'
})

const phoneSchema = Joi.string()
.pattern(/^(\+62|62|0)8[1-9][0-9]{9,10}$/)
.messages({
	'string.pattern.base': 'Format telepon tidak valid'
})





const addressSchema = Joi.string()
.pattern(/^[a-zA-Z][a-zA-Z\d\s.,\-()/]*$/)
.max(200)
.messages({
	'string.pattern.base': 'Alamat harus berupa huruf besar, huruf kecil, dan angka. Diperbolehkan menggunakan spasi dan simbol .,-()/',
	'string.min': 'Alamat maksimal 200 karakter',
	'string.max': 'Alamat maksimal 200 karakter',
	'string.empty': 'Alamat tidak boleh kosong',
	'any.required': 'Alamat tidak boleh kosong'
})

const idSubdSchema = Joi.number()
.min(1)
.max(11)
.positive()
.custom((value, helpers) => {
	if (value > Number.MAX_SAFE_INTEGER) {
      return helpers.error('number.maxSafe'); // kasih nama error custom
  }
  return value;
})
.messages({
	'number.base': 'Kecamatan tidak boleh kosong',
	'number.maxSafe': 'Kecamatan tidak valid',
	'number.min': 'Kecamatan tidak boleh kosong',
	'number.max': 'Kecamatan tidak valid',
	'number.empty': 'Kecamatan tidak boleh kosong',
	'any.required': 'Kecamatan tidak boleh kosong'
})

const idCitySchema = Joi.number()
.min(1)
.max(11)
.positive()
.custom((value, helpers) => {
	if (value > Number.MAX_SAFE_INTEGER) {
      return helpers.error('number.maxSafe'); // kasih nama error custom
  }
  return value;
})
.messages({
	'number.base': 'Kabupaten / Kota tidak boleh kosong',
	'number.maxSafe': 'Kabupaten / Kota tidak valid',
	'number.min': 'Kabupaten / Kota tidak boleh kosong',
	'number.max': 'Kabupaten / Kota tidak valid',
	'number.empty': 'Kabupaten / Kota tidak boleh kosong',
	'any.required': 'Kabupaten / Kota tidak boleh kosong'
})

const idProvSchema = Joi.number()
.min(1)
.max(11)
.positive()
.custom((value, helpers) => {
	if (value > Number.MAX_SAFE_INTEGER) {
      return helpers.error('number.maxSafe'); // kasih nama error custom
  }
  return value;
})
.messages({
	'number.base': 'Provinsi tidak boleh kosong',
	'number.maxSafe': 'Provinsi tidak valid',
	'number.min': 'Provinsi tidak boleh kosong',
	'number.max': 'Provinsi tidak valid',
	'number.empty': 'Provinsi tidak boleh kosong',
	'any.required': 'Provinsi tidak boleh kosong'
})

export {
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
}