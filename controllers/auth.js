const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
})

// sendgrid does not work
/* const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: ''
    }
  })
);*/

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message,
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
            req.flash('error', 'Invalid email or password.')
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
                req.flash('error', 'E-mail exists already, please pick a different one')
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
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject: 'Signup succeeded!',
                        text: '<h1>You successfully signed up!</h1>'
                    }, (err, info) => {
                        if (err) {
                          console.error('error email', err);
                          return;
                        }
                        console.log('email info: ', info.envelope);
                        console.log(info.messageId);
                      }
                      )
                })
                .catch(err => {
                    console.error('err req: ', err)
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