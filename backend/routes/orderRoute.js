import express from 'express'
import {placeOrder, placeOrderStripe, placeOrderRazorpay, placeOrderCOD, placeGuestOrderRazorpay, placeGuestOrderCOD, verifyGuestRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay, deleteOrder} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)
orderRouter.post('/delete',adminAuth,deleteOrder)

// Payment Features (Authenticated)
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)
orderRouter.post('/cod',authUser,placeOrderCOD)

// Guest Payment Features (No Auth Required)
orderRouter.post('/guest/razorpay', placeGuestOrderRazorpay)
orderRouter.post('/guest/cod', placeGuestOrderCOD)
orderRouter.post('/guest/verifyRazorpay', verifyGuestRazorpay)

// User Feature 
orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyStripe',authUser, verifyStripe)
orderRouter.post('/verifyRazorpay',authUser, verifyRazorpay)

export default orderRouter