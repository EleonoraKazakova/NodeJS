const path = require('path')

const express = require('express')
const rootDir = require('../util/path')

const router = express.Router()
  
// /admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    console.log('Product page!')
    
    // res.send('<body><form action="/admin/add-product" method="POST"> <input type="text" name="title"><button type="submit">Send</button></form><body>')
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
} )

// /admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/')
})  

module.exports = router
