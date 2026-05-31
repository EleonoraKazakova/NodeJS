const path = require('path')

const express = require('express')
const validationResult = require('express-validator')

const adminController = require('../controllers/admin')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

  
// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct)

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts)

// /admin/add-product => POST
router.post('/add-product', [
    validationResult.check('title')
    .isString()
    .isLength({min: 3})
    .trim(),

   /* validationResult.check('imageUrl')
    .isURL(),*/

    validationResult.check('price')
    .isFloat(),

    validationResult.check('description')
    .isLength({min: 1, max: 10})
    .trim(),
], isAuth, adminController.postAddProduct)  

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)  

router.post('/edit-product', [
    validationResult.check('title')
    .isString()
    .isLength({min: 3})
    .trim(),

    validationResult.check('price')
    .isFloat(),

    validationResult.check('description')
    .isLength({min: 1, max: 10})
    .trim(),
], isAuth, adminController.postEditProduct)

router.post('/delete-product', isAuth, adminController.postDeleteProduct)

module.exports = router

