class ErrorResponse extends Error {
	constructor(status, message){
		super(message)
		this.status = status
		this.message = message
	}

	// toJSON(){
	// 	return {
	// 		errors: JSON.parse(message)
	// 	}
	// }
}

export {ErrorResponse}