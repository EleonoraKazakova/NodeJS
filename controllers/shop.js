const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts =  (req, res, next) => {
    console.log('getProducts_shop')

    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'All products', 
            path: "/products", 
           })
    })
 }  

 exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findByID(prodId, product => {
        console.log('prodduct: ', product)
        res.render('shop/product-detail', {
            product: product, 
            pageTitle: product.title,
            path: '/products'
        })
    })
    
    // res.redirect('/')
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

 exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    console.log('prodId: ', prodId)

    Product.findByID(prodId, product => {
        Cart.addProduct(prodId, product.price)
    })
    res.redirect('/cart')
 }

 exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your cart'
    })
 }

 exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
 }