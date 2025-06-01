import {
	removeAllMerchant,
	createMerchant
} from './test-util.js'
import supertest from 'supertest'
import {app} from '../src/application/app.js'
import {logger} from '../src/application/logger.js'

describe('POST /api/merchant', function(){
	afterEach(async () => {
		await removeAllMerchant()
	})

	it('Should can register new merchant', async() => {
		const result = await supertest(app)
		.post('/api/merchant')
		.send({
			username: 'andika_fahri1',
			password: 'andika1A',
			confirm_password: 'andika1A',
			name: 'Andika Chili Oil',
			address: 'Jl. Abd Masjid RT.15 RW.3 Desa Ngebruk',
			id_subd: '1',
			id_city: '1',
			id_prov: '1',
			email: 'andika@gmail.com',
			phone: ''
		})

		logger.info(result.body)

		expect(result.status).toBe(200)
		expect(result.body.message).toBeDefined()
		expect(result.body.data).toBeUndefined()
	})

	it('Should can reject if request empty', async() => {
		const result = await supertest(app)
		.post('/api/merchant')
		.send({
			username: '',
			password: '',
			confirm_password: '',
			name: '',
			address: '',
			id_subd: '',
			id_city: '',
			id_prov: '',
			email: '',
			phone: ''
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should can reject if request with space', async() => {
		const result = await supertest(app)
		.post('/api/merchant')
		.send({
			username: ' ',
			password: ' ',
			confirm_password: ' ',
			name: ' ',
			address: ' ',
			id_subd: ' ',
			id_city: ' ',
			id_prov: ' ',
			email: ' ',
			phone: ' '
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should can reject if request invalid', async() => {
		const result = await supertest(app)
		.post('/api/merchant')
		.send({
			username: 'adas dada',
			password: 'dsa dadas',
			confirm_password: 'dsdsd effefe',
			name: 'as2',
			address: 'dads dadada!+_',
			id_subd: 'a',
			id_city: 'a',
			id_prov: 'a',
			email: 'asasasa sasa',
			phone: '123'
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should can reject if request too short', async() => {
		const result = await supertest(app)
		.post('/api/merchant')
		.send({
			username: 'a',
			password: 'a',
			confirm_password: 'a',
			name: 'a',
			address: 'a',
			id_subd: 'a',
			id_city: 'a',
			id_prov: 'a',
			email: 'a',
			phone: '0'
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should can reject if request too long', async() => {
		const result = await supertest(app)
		.post('/api/merchant')
		.send({
			username: 'aaaaaaaaaaaaaaaaaaaaaaaaaa',
			password: 'aaaaaaaaaaaaaaaaaaaaaaaaaa',
			confirm_password: 'aaaaaaaaaaaaaaaaaaaaaaaaaa',
			name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			address: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
			id_subd: '111111111111111111111111',
			id_city: '111111111111111111111111',
			id_prov: '111111111111111111111111',
			email: 'aaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com',
			phone: '0812231321143143131'
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})
})

describe('POST /api/merchant/login', function(){
	beforeEach(async () => {
		await createMerchant()
	})

	afterEach(async () => {
		await removeAllMerchant()
	})

	it('Should can login merchant', async() => {
		const result = await supertest(app)
		.post('/api/merchant/login')
		.send({
			username: 'andika_fahri1',
			password: 'andika1A'
		})

		logger.info(result.body)

		expect(result.status).toBe(200)
		expect(result.body.token).toBeDefined()
		expect(result.body.data).toBeUndefined()
	})

	it('Should reject if request empty', async() => {
		const result = await supertest(app)
		.post('/api/merchant/login')
		.send({
			username: '',
			password: ''
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should reject if request with space', async() => {
		const result = await supertest(app)
		.post('/api/merchant/login')
		.send({
			username: ' ',
			password: ' '
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should reject if request invalid', async() => {
		const result = await supertest(app)
		.post('/api/merchant/login')
		.send({
			username: 'sda ada',
			password: 'ads dsda'
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

})