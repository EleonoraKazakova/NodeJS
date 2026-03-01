const path = require("path");

const express = require("express");
const parsedBody = require("body-parser");

const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect
const User = require('./models/user')

const app = express();

app.set("view engine", "ejs"); // compile tamplate
app.set("views", "views"); // where to finedƒ

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(parsedBody.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    User.findById("69a45574cc3a896569b6f8b5")
        .then(user => {
           // console.log('user from app.use_11: ', user)
            req.user = user
            next()
        })
        .catch(err => console.error())
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(client => {
    app.listen(3000)
})

