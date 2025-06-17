import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'

const get = async (id_city) => {
	return prismaClient.subdistrict.findMany({
		where: {
			id_city: Number(id_city)
		},
		select: {
			id: true,
			name: true
		}
	})
}

export default {
	get
}