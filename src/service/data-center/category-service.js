import {prismaClient} from '../../application/database.js'

const get = async () => {
	return prismaClient.category.findMany({
		select: {
			id: true,
			name: true
		}
	})
}

export default {
	get
}