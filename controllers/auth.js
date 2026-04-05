exports.getLogin = (req, res, next) => {
   /*console.log('Cookie:', req.get('Cookie').split('=')[1])
    const isLoggedIn = req.get('Cookie').trim().split('=')[1]
    console.log('Cookie isLoggedIn:', isLoggedIn)*/
    console.log('session: ', req.session.isLoggedIn)
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true
    res.redirect('/');
};