const User = require('../models/user');
const bcrypt = require('bcryptjs')

exports.getLogin = (req, res, next) => {
    console.log('session: ', req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res, next) => {
   User.findById("69c00e670b56b8cf4df7c8c3")
    .then(user => {
        req.session.isLoggedIn = true
        req.session.user = user
        req.session.save(err => {
            console.error(err)
            res.redirect('/');
        })
        
        console.log('req.session.isLoggedIn: ', req.session.isLoggedIn)
    })
    .catch(error => console.log('Error user: ', error))
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    User.findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup')
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    })
                    return user.save()
                })
                .then(result => {
                    res.redirect('/login')
                })
        })
        
        .catch(err => console.log('postSignup', err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log('destroy err:', err);
      res.redirect('/');
    });
  };