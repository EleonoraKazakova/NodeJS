const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts =  (req, res, next) => {
    console.log('getProducts_shop')

    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products, 
                pageTitle: 'All products', 
                path: "/products", 
               })
        })
        .catch(err=> console.error(err))
 }  

 exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findByPk(prodId)
        .then((product) => {
            console.log('prodduct: ', product)
            res.render('shop/product-detail', {
                product: product, 
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console(err))

    /*Product.findAll({ where: { id: prodId }})
        .then(products => {
            console.log('prodducts: ', products)
                res.render('shop/product-detail', {
                    product: products[0], 
                    pageTitle: products[0].title,
                    path: '/products'
                })
        })
        .catch(err => console.log(err))*/
   
 }

 exports.getIndex = (req, res, next) => {
    console.log('getIndex')
    Product.findAll()
        .then(products => {
            res.render('shop/index', {
                prods: products, 
                pageTitle: 'Shop', 
                path: "/", 
            })
        })
        .catch(err => console.error(err) ) 
 }

 exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        
        Product.fetchAll(products => {
            const cartProducts = []
            for (product of products) {
                cartProducts = cart.products.find(prod => prod.id === product.id)
                if (cartProducts) {
                    cartProducts.push({productData: product, qty: cartProductData.qty})
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your cart',
                products: cartProducts
            })
        })
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