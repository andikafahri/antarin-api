// CONTROLLER
import express from 'express'
import userController from '../controller/user/user-controller.js'
import courierController from '../controller/courier-controller.js'
import merchantController from '../controller/merchant-controller.js'
import menuController from '../controller/menu-controller.js'
// import variantController from '../controller/variant-controller.js'
import orderUserController from '../controller/user/order-controller.js'
import orderMerchantController from '../controller/merchant/order-controller.js'
import orderCourierController from '../controller/courier/order-controller.js'



// MIDDLEWARE
import {authUserMiddleware} from '../middleware/auth-user-middleware.js'
import {authCourierMiddleware} from '../middleware/auth-courier-middleware.js'
import {authMerchantMiddleware} from '../middleware/auth-merchant-middleware.js'



// MAKE ROUTER
const userRouter = new express.Router()
const courierRouter = new express.Router()
const merchantRouter = new express.Router()
const menuRouter = new express.Router()
// const variantRouter = new express.Router()
const orderUserRouter = new express.Router()
const orderMerchantRouter = new express.Router()
const orderCourierRouter = new express.Router()



// MIDDLEWARE
userRouter.use(authUserMiddleware)
courierRouter.use(authCourierMiddleware)
merchantRouter.use(authMerchantMiddleware)
menuRouter.use(authMerchantMiddleware)
// variantRouter.use(authMerchantMiddleware)
orderUserRouter.use(authUserMiddleware)
orderMerchantRouter.use(authMerchantMiddleware)
orderCourierRouter.use(authCourierMiddleware)



// USER
userRouter.get('/', userController.get)
userRouter.patch('/', userController.update)
userRouter.put('/change_password', userController.updatePassword)

// COURIER
courierRouter.get('/', courierController.get)
courierRouter.patch('/', courierController.update)
courierRouter.put('/change_password', courierController.updatePassword)

// MERCHANT
merchantRouter.get('/', merchantController.get)
merchantRouter.patch('/', merchantController.update)
merchantRouter.put('/change_password', merchantController.updatePassword)

// MENU
menuRouter.post('/', menuController.createwithVariant)
menuRouter.get('/', menuController.getList)
menuRouter.get('/:id', menuController.getCurrentWithVariant)
menuRouter.put('/:id', menuController.updateWithVariant)
menuRouter.delete('/:id', menuController.remove)

// VARIAN
// variantRouter.post('/:id_menu', variantController.create)

// ORDER USER
orderUserRouter.post('/:id_merchant', orderUserController.create)
orderUserRouter.get('/', orderUserController.get)
orderUserRouter.get('/unavailable', orderUserController.getUnavailable)
orderUserRouter.put('/unavailable/confirm', orderUserController.confirm)

// ORDER MERCHANT
orderMerchantRouter.get('/', orderMerchantController.get)
orderMerchantRouter.post('/:id_order/reject', orderMerchantController.reject)
orderMerchantRouter.post('/:id_order/accept', orderMerchantController.accept)
orderMerchantRouter.post('/:id_order/unavailable', orderMerchantController.unavailable)
orderMerchantRouter.post('/:id_order/finish', orderMerchantController.finish)

// ORDER COURIER
orderCourierRouter.get('/', orderCourierController.get)
orderCourierRouter.post('/deliver', orderCourierController.deliver)
orderCourierRouter.post('/finish', orderCourierController.finish)

export {
	userRouter,
	courierRouter,
	merchantRouter,
	menuRouter,
	// variantRouter
	orderUserRouter,
	orderMerchantRouter,
	orderCourierRouter
}
