const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
    console.log('admin EditProduct')
    
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

    const product = new Product(null, title, imageUrl, price, description)
    product.save()
    res.redirect('/')
}

exports.getEditProduct = (req, res, next) => {
    console.log('getEditProduct_6: ', req.params)
    const editMode = req.query.edit
    console.log('editMode: ', editMode)
    if(!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    console.log('prodId_1: ', prodId)
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

exports.postEditProduct = (req, res, next) => {
    console.log('req.body_10: ', req.body)
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description
    const updatedProduct = new Product(prodId, updatedTitle, updatedPrice, updatedImageUrl, updatedDescription)
    
    console.log('new ptoduct: ', updatedProduct, req.body)

    updatedProduct.save()
    res.redirect('/admin/products')

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

 exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
 }