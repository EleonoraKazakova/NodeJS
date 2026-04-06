const path = require("path");

const express = require("express");
const parsedBody = require("body-parser");
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require("connect-mongodb-session")(session)

const errorController = require('./controllers/error')
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://eleonorakazakova89_db_user:dSJtbmD77k57I1K8@cluster0.wangstz.mongodb.net/shop?appName=Cluster0'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

app.set("view engine", "ejs"); // compile tamplate
app.set("views", "views"); // where to finedƒ

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth")

app.use(parsedBody.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false, 
    store: store
}))

app.use((req, res, next) => {
    if (!req.session.user) {
        return next()
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user
        next()
    })
    .catch(error => console.log('Error user: ', error))
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
        .then(reult=> { 
            User.findOne().then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Ella',
                        email: 'ella@test.com',
                        cart: {
                            items: []
                        }
                    })
                    user.save()
                }
            })
           
            app.listen(3000)
        })
        .catch(err => console.error('User error', err))

