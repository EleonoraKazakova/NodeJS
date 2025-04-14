const fs  = require('fs')
const path = require('path')

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
    constructor(t) {
        this.title = t
    }

    save() {
        console.log('this: ', this)
        getProductsFromFile(products => {
            products.push(this)
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err)
            })
        })
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
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