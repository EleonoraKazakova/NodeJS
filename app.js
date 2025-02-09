const express = require('express')
const parsedBody = require('body-parser')

const app = express()

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

app.use(parsedBody.urlencoded({extended: false}))

app.use('/admin', adminRoutes)
app.use(shopRoutes)

app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>')
})

app.listen(3000)

/* app.use('/runs', (req, res, next) => {
    console.log('This always runs!')
    next() // Alows the request to continue to the next middleware in line
} ) */


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