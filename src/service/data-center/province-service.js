import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'

const get = async () => {
	return prismaClient.province.findMany({
		select: {
			id: true,
			name: true
		}
	})
}

export default {
	get
}