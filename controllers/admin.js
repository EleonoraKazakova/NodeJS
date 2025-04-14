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

exports.getProducts = (req, res, next) => {
    console.log('getProducts_admin_products')

    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products, 
            pageTitle: 'Admin Products', 
            path: "/admin/products", 
           })
    })
 }