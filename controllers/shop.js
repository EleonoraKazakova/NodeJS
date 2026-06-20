const fs = require('fs')
const path = require('path')

const PDFDocument = require('pdfkit')

const Product = require('../models/product')
const Order = require('../models/order')

const ITEMS_PER_PAGE = 1

exports.getProducts =  (req, res, next) => {
    Product.find()
        .then(products => {
            console.log('getProducts_00')
            res.render('shop/product-list', {
                prods: products, 
                pageTitle: 'All products', 
                path: "/products", 
               })
        })
        .catch(err => {
            console.log(err)
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        });
 }  

 exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product, 
                pageTitle: product.title,
                path: '/products',
            })
        })
        .catch(err => {
            console.log(err)
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        });

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
    const page = Number(req.query.page) || 1
    let totalItems
    console.log('getIndex_099: ', req.query)

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts
            return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
        })
        .then(products => {
            res.render('shop/index', {
                prods: products, 
                pageTitle: 'Shop', 
                path: "/",
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviosPage: page > 1,
                nextPage: page + 1,
                previosPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })
        .catch(err => {
            console.log(err)
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        });
 }

 exports.getCart = (req, res, next) => {
     console.log('req.user.cart_00: ', req.user.cart)
    req.user
        .populate('cart.items.productId')
        .then(user => {
            console.log('getCart products: ', user.cart.items)
            const products = user.cart.items
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
            })      
        })
        .catch(err => {
            console.log('getCart error: ', err)
            const error = new Error(err)
            error.httpStatusCode = 500
            return next(error)
        });
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
                console.log('postCart: ', result, result.cart)
                res.redirect('/cart')
            })
            .catch(err => {
                console.log('postCart error: ', err)
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
 }

 exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user.removeFromCart(prodId)
            .then(result => {
                res.redirect('/cart')
            })
            .catch(err => {
                console.log(err)
                const error = new Error(err)
                error.httpStatusCode = 500
                return next(error)
            });
 }


 exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        console.log('postCart products: ', user.cart.items)
        const products = user.cart.items.map(i => {
            return {quantity: i.quantity, product: {...i.productId._doc}}
        })
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
           })
        return order.save()
    })
    .then(result => {
        return req.user.clearCart()
      })
    .then(result => {
        res.redirect('/orders');
      }  )
    .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
    });
  };

  exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
      .then(orders => {
        console.log(orders)
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
        });
      })
      .catch(err => {
        console.log(err)
        const error = new Error(err)
        error.httpStatusCode = 500
        return next(error)
      });
  };

  exports.getInvoice = ( req, res, next ) => {
    const orderId = req.params.orderId
    Order.findById(orderId)
        .then(order => {
            console.log('Order_00: ', order.user.userId.toString(), req.user._id.toString())
            if (!order) {
                return next(new Error('No order found.'))
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'))
            }

            const invoiceName = 'invoice-' + orderId + '.pdf'
            const invoicePath = path.join('data', 'invoices', invoiceName)

            const pdfDoc = new PDFDocument()
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')

            pdfDoc.pipe(fs.createWriteStream(invoicePath))
            pdfDoc.pipe(res)

            pdfDoc.fontSize(26).text('Invoice', {underline: true})
            pdfDoc.text('---------------------------------------')

            let totalPrice = 0
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price
                pdfDoc.fontSize(14).text(prod.product.title + '-' + prod.quantity + ' x ' + '$' + prod.product.price)
            })
            pdfDoc.text('---------')
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice)


            pdfDoc.end()

            /*fs.readFile(invoicePath, (err, data) => {
                if (err) {
                    return next(err)
                }
                res.setHeader('Content-Type', 'application/pdf')
                // res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"')
                res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
                res.send(data)
            })*/
            /* const file = fs.createReadStream(invoicePath)
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
            file.pipe(res) */
        })
        .catch(err => {
            next(err)
        })
    

  }

 /* exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
 } */