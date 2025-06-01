import {removeAllUser, createUser} from './test-util.js'
import supertest from 'supertest'
import {app} from '../src/application/app.js'
import {logger} from '../src/application/logger.js'

describe('POST /api/user', function(){
	afterEach(async () => {
		await removeAllUser()
	})

	it('Should can register new user', async() => {
		const result = await supertest(app)
		.post('/api/user')
		.send({
			username: 'andika_fahri',
			password: 'cemara5A@',
			name: 'Andika Fahri',
			email: 'andika@gmail.com',
			phone: '085797439513'
		})

		logger.info(result.body)

		expect(result.status).toBe(200)
		expect(result.body.message).toBeDefined()
	})

	it('Should reject if input empty', async() => {
		const result = await supertest(app)
		.post('/api/user')
		.send({
			username: '',
			password: '',
			name: '',
			email: '',
			phone: ''
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should reject if invalid', async() => {
		const result = await supertest(app)
		.post('/api/user')
		.send({
			username: '1a a',
			password: 'cema ra5A@',
			name: 'Andika 13',
			email: 'andika@gmailcom',
			phone: '2383823872'
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should reject if input too short', async() => {
		const result = await supertest(app)
		.post('/api/user')
		.send({
			username: 'a',
			password: 'a',
			name: 'a',
			email: 'a',
			phone: '6'
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})

	it('Should reject if input too long', async() => {
		const result = await supertest(app)
		.post('/api/user')
		.send({
			username: '1adasdadasdfafadasdadnjk3934ijsadd89h12e21',
			password: 'cemara5A@fasadasdasda37&8321dadas',
			name: 'Andika dasdasd dasjkdn adkjsnjda askdjnas as dajsndka',
			email: 'andikaddksadjaskdasjddaskjdsadasdadsasadadadadasdad@gmail.com',
			phone: '0859328937719312123'
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})
})

describe('POST /api/user/login', function(){
	beforeEach(async () => {
		await createUser()
	})

	afterEach(async () => {
		await removeAllUser()
	})

	it('Should can login', async () => {
		const result = await supertest(app)
		.post('/api/user/login')
		.send({
			username: 'andika_fahri51',
			password: 'andika5A@'
		})

		logger.info(result.body)

		expect(result.status).toBe(200)
		expect(result.body.token).toBeDefined()
	})

	it('Should reject if invalid', async () => {
		const result = await supertest(app)
		.post('/api/user/login')
		.send({
			username: '1@and ahri',
			password: 'andi ka5A@'
		})

		logger.info(result.body)

		expect(result.status).toBe(400)
		expect(result.body.errors).toBeDefined()
	})
})

describe('GET /api/user', function(){
	beforeEach(async () => {
		await createUser()
	})

	afterEach(async () => {
		await removeAllUser()
	})

	it('Should can get user', async () => {
		const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImcycGM1M3o0bTl3ZnFndzUiLCJpYXQiOjE3NDU1NjM5OTgsImV4cCI6MTc0NTU2NDU5OH0.2cF281NjrMOUUxYnN-GA1TPokU6MGVQs13AkKZQnpYQ'
		const result = await supertest(app)
		.get('/api/user')
		.set('Authorization', 'Bearer ' + token)

		logger.info(result.body)

		expect(result.status).toBe(200)
		expect(result.body).toBeDefined()
	})
})