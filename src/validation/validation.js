import {ErrorResponse} from '../application/error-response.js'

const validate = (schema, request) => {
	// const result = schema.validate(request, {
	// 	abortEarly: false,
	// 	allowUnknown: false
	// })

	// if(result.error){
		// throw new ErrorResponse(400, result.error.message)

	const result = schema.validate(request, {
		abortEarly: false,
		allowUnknown: false
	})

	if(result.error){

		const formatted = {}
		result.error.details.forEach((err) => {
			const key = err.path[0]
			if(!formatted[key]){
				formatted[key] = err.message
			}
		})

		throw new ErrorResponse(400, formatted)
		// return res.status(400).json({ errors: formatted })
		// return {error: formatted}
		// throw {formatted}
	}else{
		return result.value
		// return {value: result.value}
	}
}

export {validate}