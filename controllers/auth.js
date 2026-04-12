const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { redirect } = require('next/dist/server/api-utils');

exports.getLogin = (req, res, next) => {
    console.log('session: ', req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error')
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            req.flash('error', 'Invalid email or password.')
            return res.redirect('/login')
        }
        bcrypt.compare(password, user.password)
        .then((doMatch) => {
            if (doMatch) {
                req.session.isLoggedIn = true
                req.session.user = user
                return req.session.save(err => {
                    console.error(err)
                    res.redirect('/');
                })
            }
            res.redirect('/login')
        })
        .catch(err => {
            console.error(err)
            res.redirect('/login')
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