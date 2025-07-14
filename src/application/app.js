import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import cors from 'cors'
import path from 'path'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs'
import {
	publicRouter,
	public2Router,
	publicRouterDataCenter,
	publicRouterScheduleJob
} from '../route/public-api.js'
import {
	userRouter,
	courierRouter,
	merchantRouter,
	menuRouter,
	categoryRouter,
	// variantRouter
	orderUserRouter,
	orderMerchantRouter,
	orderCourierRouter
	// imageMerchantRouter
} from '../route/api.js'
import {errorMiddleware} from '../middleware/error-middleware.js'
import {authSocketUser} from '../middleware/auth-socket-user.js'
import {authSocketMerchant} from '../middleware/auth-socket-merchant.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*'
	}
})

// io.on('connection', (socket) => {
// 	console.log('Client connected');

// 	// SOCKET UPDATE ORDER FOR USER
// 	socket.on('subscribeToOrderUser', (idOrder) => {
// 		console.log(`User subscribed to ${idOrder}`);
// 		socket.join(idOrder); // gabung ke room order
// 	});

// 	// SOCKET UPDATE ORDER FOR MERCHANT
// 	socket.on('subscribeToOrderMerchant', (idMerchant) => {
// 		console.log(`Merchant subscribed to ${idMerchant}`);
// 		socket.join(idMerchant); // gabung ke room order
// 	});
// });

const userSocket = io.of('/user')
const merchantSocket = io.of('/merchant')
const courierSocket = io.of('/courier')
authSocketUser(userSocket)
authSocketMerchant(merchantSocket)

app.use(cors({
	origin: ['https://antarin-web.vercel.app', 'https://bluewhaledelivery.vercel.app', 'https://antarin.free.nf', 'http://antarin.free.nf'],
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true
	}));



const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// app.use('/img/user', express.static(path.join(__dirname, '../../public/uploads/images/')))
app.use('/img/user', (req, res, next) => {
	const imagePath = path.join(__dirname, '../../public/uploads/images/user', req.user.id)

	if(!fs.existsSync(imagePath)){
		return res.status(404).send('Not Found')
	}

	express.static(imagePath)(req, res, next)
})

app.use('/img/merchant/:id_merchant', (req, res, next) => {
	const idMerchant = req.params.id_merchant
	const imagePath = path.join(__dirname, '../../public/uploads/images/merchant', idMerchant)

	if(!fs.existsSync(imagePath)){
		return res.status(404).send('Not Found')
	}

	express.static(imagePath)(req, res, next)
})

app.use('/img/courier', (req, res, next) => {
	const imagePath = path.join(__dirname, '../../public/uploads/images/courier', req.courier.id)

	if(!fs.existsSync(imagePath)){
		return res.status(404).send('Not Found')
	}

	express.static(imagePath)(req, res, next)
})


app.use(express.json())
app.use(publicRouter)
app.use('/api/public', public2Router)
app.use('/api/user', userRouter)
app.use('/api/courier', courierRouter)
app.use('/api/merchant', merchantRouter)
app.use('/api/menu', menuRouter)
app.use('/api/category', categoryRouter)
// app.use('/api/variant', variantRouter)
app.use('/api/user/order', orderUserRouter)
app.use('/api/merchant/order', orderMerchantRouter)
app.use('/api/courier/order', orderCourierRouter)

// DATA CENTER
app.use('/api/datacenter', publicRouterDataCenter)

// SCHEDULE JOB
app.use('/api/autoaction', publicRouterScheduleJob)

// IMAGE
// app.use('/img/merchant', imageMerchantRouter)

app.use(errorMiddleware)

export {server, userSocket, merchantSocket, courierSocket}