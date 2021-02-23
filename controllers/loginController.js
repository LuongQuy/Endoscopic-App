const passport = require('passport');
const localStrategy = require('passport-local');
const users = require('../models/user');

passport.serializeUser((user, done) => {
    return done(null, user._id);
});

passport.deserializeUser((id, done) => {
    users.findById(id, (err, user) => {
        return done(null, user);
    })
});

passport.use('local.login', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    users.findOne({'local.email': email, 'local.password': password}, (err, user) => {
        if(user) {
            if(user.status === 'ACTIVE'){
                return done(null, user);
            }else if(user.status === 'INACTIVE'){
                return done(null, false, {message: 'Tài khoản của bạn không được kích hoạt'})
            }
        }else{
            return done(null, false, {message: 'Email hoặc password không đúng'});
        }
    });
}));

exports.getLogin = (req, res) => {
    res.render('login');
}
exports.postLogin = passport.authenticate('local.login', {
    successRedirect: '/doctor',
    failureRedirect: '/login'
});

exports.getLogout = (req, res) => {
    req.logout();
    res.redirect('/');
}