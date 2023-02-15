const express = require('express')

const adminRouter = require('./admin/admin.route')
const customerRouter = require('./customer/customer.route')
const sellerRouter = require('./seller/seller.route')


const api = express.Router()

api.use('/customer',customerRouter )
api.use('/admin', adminRouter)
api.use('/seller', sellerRouter)


module.exports = api


