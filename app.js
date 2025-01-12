const http = require('http')
const fs = require('fs')

const server = http.createServer(function(req, res) {
    console.log(req)
    const url = req.url
    const method = req.method
    if (url === '/') {
        res.write('<html>')
        res.write('<head><title>Second Page</title></head>')
        res.write('<body><form action="/message" method="POST"> <input type="text" name="message"><button type="submit">Send</button></form><body>')
        res.write('</html>')
        return res.end()
    }
    if (url === '/message' && method === 'POST' ) {
        fs.writeFileSync('message.txt', 'DUMMY')
        res.statusCode = 302
        res.setHeader('Location', '/')
        return res.end()
    }

    res.setHeader('Content-Type', 'text/html')
    res.write('<html>')
    res.write('<head><title>My First Page</title></head>')
    res.write('<body><h1> Eleonora Kazakova</h1><body>')
    res.write('</html>')
    res.end('')
})
server.listen(3000)


/*http.createServer(function(req, res) {
    console.log(req)
    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.setHeader('Content-Type', 'text/html')
    res.end('Hello, World!\n')
}).listen(8124, '127.0.0.1')
console.log('Server running at http://127.0.0.1:8124')*/