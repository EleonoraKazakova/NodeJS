const path = require("path");

const express = require("express");
const parsedBody = require("body-parser");

const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')

const app = express();

app.set("view engine", "ejs"); // compile tamplate
app.set("views", "views"); // where to finedƒ

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(parsedBody.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            console.log('user from app.use_11: ', user)
            req.user = user
            next()
        })
        .catch(err => console.error())
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})

sequelize
    // .sync({force: true})
     .sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
           return User.create({name: 'Max', email: 'test@test.com'})
        }
        return user
    })
    .then(user => {
        // console.log('user from sequelize_12', user)
         return user.createCart()
    })
    .then(cart => {
        app.listen(3000)
    })
    .catch(err => {
        console.error(err)
    })


/*db.execute('SELECT * FROM products')
    .then((result) => {console.log(result)})
    .catch((err) => {console.log(err)})*/
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
