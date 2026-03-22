const Product = require('../models/product')
const Order = require('../models/order')
const user = require('../models/user')

exports.getProducts =  (req, res, next) => {
    Product.find()
        .then(products => {
            console.log('getProducts')
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
    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product, 
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.error(err))

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
    Product.find()
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
    // console.log('req.user.cart: ', req.user.cart)
    req.user
        .populate('cart.items.productId')
        .then(user => {
            console.log('getCart products: ', user.cart.items)
            const products = user.cart.items
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            })      
        })
        .catch(err => console.error(err))
    // Cart.getCart(cart => {
        
    //     Product.fetchAll(products => {
    //         const cartProducts = []
    //         for (product of products) {
    //             cartProducts = cart.products.find(prod => prod.id === product.id)
    //             if (cartProducts) {
    //                 cartProducts.push({productData: product, qty: cartProductData.qty})
    //             }
    //         }
    //         res.render('shop/cart', {
    //             path: '/cart',
    //             pageTitle: 'Your cart',
    //             products: cartProducts
    //         })
    //     })
    // })
 }

 exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId)
            .then(product => {
                return req.user.addToCart(product)
            })
            .then(result => {
                console.log('postCart: ', result)
                res.redirect('/cart')
            })
 }

 exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user.deleteItemFromCart(prodId)
            .then(result => {
                res.redirect('/cart')
            })
            .catch(err => console.error(err))
 }


 exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
      .addOrder()
      .then(result => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };

  exports.getOrders = (req, res, next) => {
    req.user
      .getOrders()
      .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
        });
      })
      .catch(err => console.log(err));
  };

 /* exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
 } */