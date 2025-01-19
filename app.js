const http = require('http')

const routes = require('./routes')

const server = http.createServer(routes.handler)
server.listen(3000)


/*
const fs = require('fs')
http.createServer(function(req, res) {
    console.log(req)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.setHeader('Content-Type', 'text/html')
    res.end('Hello, World!\n')
}).listen(8124, '127.0.0.1')
console.log('Server running at http://127.0.0.1:8124')*/