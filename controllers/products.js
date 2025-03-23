const products = []

exports.getAddProduct = (req, res, next) => {
    console.log('getAddProduct')
    
    res.render('add-product', {
        pageTitle: "Add products", 
        path:'/admin/add-product', 
        productCSS: true, 
        activeAddProduct: true
    })
}

exports.postAddProduct = (req, res, next) => {
    console.log(req.body)
    products.push({title: req.body.title})
    res.redirect('/')
}

exports.getProducts =  (req, res, next) => {
    console.log('getProducts_shop')
 
    res.render('shop', {
     prods: products, 
     pageTitle: 'Shop', 
     path: "/", 
     hasProducts: products.length > 0,
     activeShop: true,
     productCSS: true
    })
 }  