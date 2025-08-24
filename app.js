const path = require("path");

const express = require("express");
const parsedBody = require("body-parser");

const errorController = require('./controllers/error')
const db = require('./util/database')

const app = express();

app.set("view engine", "ejs"); // compile tamplate
app.set("views", "views"); // where to finedƒ

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

db.execute('SELECT * FROM products')
    .then((result) => {console.log(result)})
    .catch((err) => {console.log(err)})

app.use(parsedBody.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);

/*
handlebar
const expressHbs = require('express-handlebars')

app.engine(
    'hbs', 
    expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'}))  */

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
