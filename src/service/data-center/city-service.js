import {prismaClient} from '../../application/database.js'
import {ErrorResponse} from '../../application/error-response.js'

const get = async (id_province) => {
	return prismaClient.city.findMany({
		where: {
			id_prov: Number(id_province)
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