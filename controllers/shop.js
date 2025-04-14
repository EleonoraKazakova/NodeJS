const Product = require('../models/product')

exports.getProducts =  (req, res, next) => {
    console.log('getProducts_shop')

    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All products', 
            path: "/", 
           })
    })
 }  

 exports.getIndex = (req, res, next) => {
    console.log('getProducts_index')

    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products, 
            pageTitle: 'Shop', 
            path: "/", 
           })
    })
 }

 exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your cart'
    })
 }

 exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
 }