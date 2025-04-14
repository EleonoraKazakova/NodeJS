const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    console.log('getAddProduct')
    
    res.render('admin/add-product', {
        pageTitle: "Add products", 
        path:'/admin/add-product', 
        productCSS: true, 
        activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next) => {
    console.log('postAddProduct req.body: ', req.body)
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/')
}

exports.getProducts =  (req, res, next) => {
    console.log('getProducts_shop')

    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products, 
            pageTitle: 'Shop', 
            path: "/", 
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
           })
    })
 
    
 }  