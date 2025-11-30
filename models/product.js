const Sequelize = require('sequelize')
const sequelize = require('../util/database')
const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

module.exports = Product

/*
const db = require('../util/database')
const Cart = require('./cart')


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
        return db.execute(
            'INSERT INTO products (title, price, imageUrl, description) VALUE (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description]
        )
    }

    static deleteById(id) {
        
    }

    static fetchAll(cb) {
        return db.execute('SELECT * FROM products')
    }

    static findByID(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
    } 
    }
     */

    /*
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
    
    
    
    save() {
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
