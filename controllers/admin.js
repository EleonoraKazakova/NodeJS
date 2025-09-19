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
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description

    console.log('postAddProduct req.body: ', req.body)

    Product.create({
        title: title, 
        price: price, 
        imageUrl: imageUrl, 
        description: description
    })
        .then(result => {
           console.log('Created Product')
        })
        .catch(err => console.error(err))
    
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
    Product.findByPk(prodId).then(product => {
        if(!product) {
            return res.redirect('/')
        }
        res.render('admin/edit-product', {
            pageTitle: "Edit products", 
            path:'/admin/edit-product', 
            editing: editMode,
            product: product,
        })
    }).catch(err => console.error(err))
    
}

exports.postEditProduct = (req, res, next) => {
    console.log('req.body_10: ', req.body)
    const prodId = req.body.productId
    const updatedTitle = req.body.title
    const updatedPrice = req.body.price
    const updatedImageUrl = req.body.imageUrl
    const updatedDescription = req.body.description

    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle
            product.price = updatedPrice
            product.imageUrl = updatedImageUrl
            product.description = updatedDescription
            return product.save()
        })
        .then(result => {
            console.log('Updated Product!!!')
            res.redirect('/admin/products') 
        })
        .catch(err => console.error(err))
    
   
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            console.log('products_admin: ', products)

            res.render('admin/products', {
                prods: products, 
                pageTitle: 'Admin Products', 
                path: "/admin/products", 
            })
        })
        .catch(err => console.error(err))
 }

 exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.deleteById(prodId)
    res.redirect('/admin/products')
 }