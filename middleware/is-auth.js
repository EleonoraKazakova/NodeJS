module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        console.log('middleware: ', req.session.isLoggedIn)
        return res.redirect('/login')
    }
    next()
}