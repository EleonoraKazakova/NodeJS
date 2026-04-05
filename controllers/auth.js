exports.getLogin = (req, res, next) => {
   /*console.log('Cookie:', req.get('Cookie').split('=')[1])
    const isLoggedIn = req.get('Cookie').trim().split('=')[1]
    console.log('Cookie isLoggedIn:', isLoggedIn)*/
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
    res.redirect('/');
};