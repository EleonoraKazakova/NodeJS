const fs  = require('fs')
const path = require('path')
const Cart = require('./cart')

const p = path.join(
    path.dirname(require.main.filename), 
    'data', 
    'products.json'
)

const getProductsFromFile = (cb) => {
    
    fs.readFile(p, (err, fileContent) => {
        if(err) {
            cb([])
        } else {
            cb(JSON.parse(fileContent))
        }
        
    })
}

module.exports = class Product {
    constructor(id, title, price, imageUrl, description) {
        this.id = id
        this.title = title
        this.price = price
        this.imageUrl = imageUrl
        this.description = description
    }

    save() {
        
        console.log('this: ', this)
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id)
                const updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err)
                })

            } else {
                this.id = Math.random().toString()
                products.push(this)
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err)
                })
            }
           
        })
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id)
            const updatedProducts = products.filter(prod => prod.id !== id)
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price)
                }
            })
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static findByID(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id)
            cb(product)
        })
    }

    /*save() {
        const p = path.join(
            path.dirname(require.main.filename), 
            'data', 
            'products.json'
        )

       
        
        fs.readFile(p, (err, fileContent) => {
            let products = []
            if (!err) {
                products = JSON.parse(fileContent)
            }
            
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err)
            })
        }) 
        
    } */

    /* static fetchAll(cb) {
        const p = path.join(
            path.dirname(require.main.filename), 
            'data', 
            'products.json'
        )
        fs.readFile(p, (err, fileContent) => {
            if(err) {
                cb([])
            }
            cb(JSON.parse(fileContent))
        })
       
    } */

}