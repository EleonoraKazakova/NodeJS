const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    console.log('getAddProduct')
    
    res.render('admin/edit-product', {
        pageTitle: "Add products", 
        path:'/admin/add-product', 
        editing: false,
    })
}

exports.postAddProduct = (req, res, next) => {
    console.log('postAddProduct req.body_1: ', req.body)
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    console.log('postAddProduct req.body: ', req.body)

    const product = new Product(title, imageUrl, price, description)
    product.save()
    res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
    console.log('getEditProduct')
    const editMode = req.require.edit
    if(!editMode) {
        return res.redirect('/')
    }
    const prodId = req.param.productId
    Product.findByID(prodId, product => {
        if(!product) {
            return res.redirect('/')
        }
        res.render('admin/edit-product', {
            pageTitle: "Edit products", 
            path:'/admin/edit-product', 
            editing: editMode,
            product: product,
        })
    })
    
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        console.log('products_admin: ', products)

        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: "/admin/products", 
           })
    })
 }