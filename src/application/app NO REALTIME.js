import express from 'express'
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

export const app = express()

// app.use((req, res, next) => {
// 	res.header("Access-Control-Allow-Origin", "http://192.168.43.226:5173");
// 	res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
// 	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true"); // jika pakai cookies/token
//   next();
// });

app.use(cors({
	origin: 'http://192.168.43.226:5173',
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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