const express = require('express')
const app = express()

app.use('/runs', (req, res, next) => {
    console.log('This always runs!')
    next() // Alows the request to continue to the next middleware in line
} )

app.use('/add-product', (req, res, next) => {
    console.log('Product page!')
    res.send('<h1>The Add Product page</h1>')
   
} )

app.use((req, res, next) => {
    console.log('In another middleware!')
    res.send('<h1>Hello from Express!</h1>')
} )

app.listen(3000)




// const http = require('http')
// const server = http.createServer(app)
// server.listen(3000)

// const routes = require('./routes')
//const server = http.createServer(routes.handler)

/*
const fs = require('fs')
http.createServer(function(req, res) {
    console.log(req)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.setHeader('Content-Type', 'text/html')
    res.end('Hello, World!\n')
}).listen(8124, '127.0.0.1')
console.log('Server running at http://127.0.0.1:8124')*/