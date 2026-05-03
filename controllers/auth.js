const crypto = require('crypto')
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    sendmail: true,
    newline: "unix",
    path: "/usr/sbin/sendmail",
    /*service: 'gmail',
    secure: false, // use SSL
    auth: {
        user: '1a2b3c4d5e6f7g',
        pass: '1a2b3c4d5e6f7g',
    }*/
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

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.error('postReset err: ', err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                req.flash('error', 'No account with that email found.')
                return res.redirect('/reset')
            }
            user.resetToken = token
            user.resetTokenExpiration = Date.now() + 3600000
            return user.save()
        })
        .then(result => {
            console.log('reset link: ', `http://localhost:3000/reset/${token}`)
            res.redirect('/')
            transporter.sendMail({
                to: req.body.email,
                from: 'shop@node-complete.com',
                subject: 'Password reset',
                text: `
                <p>Yiu requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.
                `
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
        .catch(err => console.error('User.findOne email: ', err))
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token
    console.log('token: ', token)
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()} })
        .then(user => {
            console.log('user get passwd: ', user)
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => console.error('getNewPassword err: ', err))
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password
    const userId = req.body.userId
    const passwordToken = req.body.passwordToken
    let resetUser

    User.findOne({
        resetToken: passwordToken, 
        resetTokenExpiration: {$gt: Date.now()}, 
        _id: userId
    })
    .then(user => {
        resetUser = user
        return bcrypt.hash(newPassword, 12)
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword
        resetUser.resetToken = undefined
        resetUser.resetTokenExpiration = undefined
        return resetUser.save()
    })
    .then(result => {
        res.redirect('/login')
    })
    .catch(err => console.error('postNewPassword err: ', err))
}