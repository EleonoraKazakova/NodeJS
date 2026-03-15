const path = require("path");

const express = require("express");
const parsedBody = require("body-parser");
const mongoose = require('mongoose')

const errorController = require('./controllers/error')
// const User = require('./models/user')

const app = express();

app.set("view engine", "ejs"); // compile tamplate
app.set("views", "views"); // where to finedƒ

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(parsedBody.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

/*app.use((req, res, next) => {
    User.findById("69a45574cc3a896569b6f8b5")
        .then(user => {
           // console.log('user from app.use_11: ', user)
            req.user = new User(user.name, user.email, user.cart, user._id)
            next()
        })
        .catch(err => console.error())
})*/

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://eleonorakazakova89_db_user:dSJtbmD77k57I1K8@cluster0.wangstz.mongodb.net/shop?appName=Cluster0')
.then(reult=> app.listen(3000))
.catch(err => console.error(err))

