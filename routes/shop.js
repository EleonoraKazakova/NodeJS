const path = require('path')

const express = require('express')

const rootDir = require('../util/path')
const adminData = require('./admin')

const router = express.Router()

router.get('/', (req, res, next) => {
   console.log('shop.js adminData.products: ', adminData.products)

   const products = adminData.products
   res.render('shop', {prods: products, docTitle: 'Shop'})

    // res.send('<h1>Hello from Express!</h1>')
   // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
   
} )

module.exports = router