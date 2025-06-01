import express from 'express'
import http from 'http'
import {Server} from 'socket.io'
import cors from 'cors'
import {
	publicRouter,
	public2Router
} from '../route/public-api.js'
import {
	userRouter,
	courierRouter,
	merchantRouter,
	menuRouter,
	// variantRouter
	orderUserRouter,
	orderMerchantRouter,
	orderCourierRouter
} from '../route/api.js'
import {errorMiddleware} from '../middleware/error-middleware.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: '*'
	}
})

io.on('connection', (socket) => {
	console.log('Client connected');

	socket.on('subscribeToOrder', (orderId) => {
		console.log(`Client subscribed to ${orderId}`);
		socket.join(orderId); // gabung ke room order
	});
});

app.use(cors({
	origin: 'https://antarin-web.vercel.app/',
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
}));


app.use(express.json())
app.use(publicRouter)
app.use('/api/public', public2Router)
app.use('/api/user', userRouter)
app.use('/api/courier', courierRouter)
app.use('/api/merchant', merchantRouter)
app.use('/api/menu', menuRouter)
// app.use('/api/variant', variantRouter)
app.use('/api/user/order', orderUserRouter)
app.use('/api/merchant/order', orderMerchantRouter)
app.use('/api/courier/order', orderCourierRouter)

app.use(errorMiddleware)

export {server, io}