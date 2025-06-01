import express from 'express'
import userController from '../controller/user/user-controller.js'
import courierController from '../controller/courier-controller.js'
import merchantController from '../controller/merchant-controller.js'

import publicHomeController from '../controller/public/home-controller.js'
import publicMenuController from '../controller/public/menu-controller.js'
import publicDestinationController from '../controller/public/cost-controller.js'

const publicRouter = new express.Router()
const public2Router = new express.Router()

// USER
publicRouter.post('/api/user', userController.register)
publicRouter.post('/api/user/login', userController.login)

// COURIER
publicRouter.post('/api/courier', courierController.register)
publicRouter.post('/api/courier/login', courierController.login)

// MERCHANT
publicRouter.post('/api/merchant', merchantController.register)
publicRouter.post('/api/merchant/login', merchantController.login)


// HOME
public2Router.get('/home/merchant/list', publicHomeController.getList)

// CURRENT
public2Router.get('/merchant/:id_merchant', publicMenuController.getCurrentMerchant)
public2Router.get('/merchant/:id_merchant/menu', publicMenuController.getMenuByMerchant)

// SYSTEM COST
public2Router.post('/system-cost', publicDestinationController.getSystemCost)

export {
	publicRouter,
	public2Router
}