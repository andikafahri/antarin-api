// CONTROLLER
import express from 'express'
import userController from '../controller/user/user-controller.js'
import courierController from '../controller/courier-controller.js'
import merchantController from '../controller/merchant-controller.js'
import timeOperationalController from '../controller/merchant/time-operational-controller.js'
import menuController from '../controller/menu-controller.js'
// import variantController from '../controller/variant-controller.js'
import orderUserController from '../controller/user/order-controller.js'
import orderMerchantController from '../controller/merchant/order-controller.js'
import orderCourierController from '../controller/courier/order-controller.js'



// MIDDLEWARE
import {authUserMiddleware} from '../middleware/auth-user-middleware.js'
import {authCourierMiddleware} from '../middleware/auth-courier-middleware.js'
import {authMerchantMiddleware} from '../middleware/auth-merchant-middleware.js'
// import {upload} from '../middleware/upload-middleware.js'
import {upload} from '../middleware/multer-upload-middleware.js'



// MAKE ROUTER
const userRouter = new express.Router()
const courierRouter = new express.Router()
const merchantRouter = new express.Router()
const menuRouter = new express.Router()
const categoryRouter = new express.Router()
// const variantRouter = new express.Router()
const orderUserRouter = new express.Router()
const orderMerchantRouter = new express.Router()
const orderCourierRouter = new express.Router()
// const imageMerchantRouter = new express.Router()



// MIDDLEWARE
userRouter.use(authUserMiddleware)
courierRouter.use(authCourierMiddleware)
merchantRouter.use(authMerchantMiddleware)
menuRouter.use(authMerchantMiddleware)
categoryRouter.use(authMerchantMiddleware)
// variantRouter.use(authMerchantMiddleware)
orderUserRouter.use(authUserMiddleware)
orderMerchantRouter.use(authMerchantMiddleware)
orderCourierRouter.use(authCourierMiddleware)

// imageMerchantRouter.use(authMerchantMiddleware)



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
merchantRouter.patch('/', upload.single('file'), merchantController.update)
merchantRouter.put('/change_password', merchantController.updatePassword)

// TIME OPERATIONAL
merchantRouter.get('/timeoperational', timeOperationalController.getTime)
merchantRouter.post('/timeoperational', timeOperationalController.addTime)
merchantRouter.put('/timeoperational/:id', timeOperationalController.updateTime)
merchantRouter.put('/alltimeoperational/', timeOperationalController.updateAllTime)
merchantRouter.delete('/timeoperational/:id', timeOperationalController.deleteTime)
merchantRouter.post('/timeoperational/changemode/:mode', timeOperationalController.changeMode)

// MENU
menuRouter.post('/', upload.single('file'), menuController.createwithVariant)
menuRouter.get('/', menuController.getList)
menuRouter.get('/:id', menuController.getCurrentWithVariant)
menuRouter.put('/:id', upload.single('file'), menuController.updateWithVariant)
menuRouter.delete('/:id', menuController.remove)
categoryRouter.get('/', menuController.getCategory)

// VARIAN
// variantRouter.post('/:id_menu', variantController.create)

// ORDER USER
orderUserRouter.post('/create/:id_merchant', orderUserController.create)
// orderUserRouter.post('/cancel/:id_order', orderUserController.cancel)
orderUserRouter.post('/cancel', orderUserController.cancel)
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
orderCourierRouter.post('/delivered', orderCourierController.delivered)
orderCourierRouter.post('/finish', orderCourierController.finish)

// IMAGE
// imageMerchantRouter.get('/', merchantController.getImage)

export {
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
}
