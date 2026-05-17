const express = require('express')
const expressValidator = require('express-validator')
const router = express.Router()
const authController = require('../controllers/auth')

const User = require('../models/user')
 
router.get( '/login', authController.getLogin ) 

router.get( '/signup', authController.getSignup)

router.post( '/login', 
            [
                expressValidator.body('email').isEmail().withMessage('Please enter valid email.'), 
                expressValidator.body('password', 'Pssword has to be valid.').isLength({min: 4}).isAlphanumeric()
            ], 
            authController.postLogin ) 

router.post( 
    '/signup', 
    [
        expressValidator
        .check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, {req}) => {
            
            /*if (value === 'test@test.com') {
                throw new Error('This email addres is forbidden.')
            }
            return true*/
            
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                  return Promise.reject(
                    'E-Mail exists already, please pick a different one.'
                  );
                }
              });
                
        }),
        expressValidator
            .body('password', 'Please enter minimum 4 numbers or characters.')
            .isLength({min: 4})
            .isAlphanumeric(),
        expressValidator
            .body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!')
                }
                return true
            }),
    ], 
    authController.postSignup
)

router.post( '/logout', authController.postLogout ) 

router.get( '/reset', authController.getReset )

router.post( '/reset', authController.postReset )

router.get( '/reset/:token', authController.getNewPassword )

router.post( '/new-password', authController.postNewPassword )

module.exports = router