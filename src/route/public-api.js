import express from 'express'
import userController from '../controller/user/user-controller.js'
import courierController from '../controller/courier-controller.js'
import merchantController from '../controller/merchant-controller.js'

import publicHomeController from '../controller/public/home-controller.js'
import publicMenuController from '../controller/public/menu-controller.js'
import publicDestinationController from '../controller/public/cost-controller.js'
import publicProvinceController from '../controller/data-center/province-controller.js'
import publicCityController from '../controller/data-center/city-controller.js'
import publicSubdistrictController from '../controller/data-center/subdistrict-controller.js'
import publicCategoryController from '../controller/data-center/category-controller.js'
import publicTimeOperationalController from '../controller/merchant/time-operational-controller.js'

import {upload} from '../middleware/upload-register-middleware.js'

const publicRouter = new express.Router()
const public2Router = new express.Router()
const publicRouterDataCenter = new express.Router()
const publicRouterScheduleJob = new express.Router()

// TEST
publicRouter.get('/api/test', (req, res) => {
	res.send('API IS CONNECTED')
})

// USER
publicRouter.post('/api/user', userController.register)
publicRouter.post('/api/user/login', userController.login)

// COURIER
publicRouter.post('/api/courier', courierController.register)
publicRouter.post('/api/courier/login', courierController.login)

// MERCHANT
publicRouter.post('/api/merchant', upload.single('image'), merchantController.register)
publicRouter.post('/api/merchant/login', merchantController.login)


// HOME
public2Router.get('/home/merchant/list', publicHomeController.getList)

// CURRENT
public2Router.get('/merchant/:id_merchant', publicMenuController.getCurrentMerchant)
public2Router.get('/timeoperational', publicMenuController.getTime)
public2Router.get('/merchant/:id_merchant/menu', publicMenuController.getMenuByMerchant)

// SYSTEM COST
public2Router.post('/system-cost', publicDestinationController.getSystemCost)

// DATA CENTER
publicRouterDataCenter.get('/province', publicProvinceController.get)
publicRouterDataCenter.get('/city/:id_province', publicCityController.get)
publicRouterDataCenter.get('/subdistrict/:id_city', publicSubdistrictController.get)
publicRouterDataCenter.get('/category', publicCategoryController.get)

// SCHEDULE JOB
publicRouterScheduleJob.post('/timeoperational', publicTimeOperationalController.autoUpdate)

export {
	publicRouter,
	public2Router,
	publicRouterDataCenter,
	publicRouterScheduleJob
}