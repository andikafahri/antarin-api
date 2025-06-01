import {prismaClient} from '../src/application/database.js'
import uniqid from 'uniqid'
import bcrypt from 'bcrypt'

// USER
const removeAllUser = async () => {
	await prismaClient.user.deleteMany()
}

const createUser = async () => {
	await prismaClient.user.create({
		data: {
			id: uniqid(),
			username: 'andika_fahri51',
			password: await bcrypt.hash('andika5A@', 10),
			name: 'Andika Fahri',
			email: 'andika@gmail.com',
			phone: '',
			poin: 0,
			id_status: 1
		}
	})
}

// MERCHANT
const removeAllMerchant = async () => {
	await prismaClient.merchant.deleteMany()
}

const createMerchant = async () => {
	await prismaClient.merchant.create({
		data: {
			id: uniqid(),
			username: 'andika_fahri1',
			password: await bcrypt.hash('andika1A', 10),
			name: 'Andika Chili Oil',
			address: 'Jl. Abd Masjid RT.15 RW.3 Desa Ngebruk',
			// id_subd: 1,
			rel_subd: {
				connect: {
					id: 1
				}
			},
			// id_city: 1,
			rel_city: {
				connect: {
					id: 1
				}
			},
			// id_prov: 1,
			rel_prov: {
				connect: {
					id: 1
				}
			},
			email: 'andika@gmail.com',
			phone: '',
			is_open: false,
			// id_status: 1,
			rel_status: {
				connect: {
					id: 1
				}
			}
		}
	})
}

export {
	removeAllUser,
	createUser,
	removeAllMerchant,
	createMerchant
}