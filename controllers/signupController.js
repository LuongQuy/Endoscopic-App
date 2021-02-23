const passport = require('passport');
const localStrategy = require('passport-local');
const users = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    users.findById(id, (err, user) => {
        return done(null, user);
    })
});

passport.use('local.signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    users.findOne({'local.email': email}, (err, user) => {
        if(user) {
            return done(null, false, {message: 'Email đã được sử dụng, vui lòng chọn email khác'})
        }else{
            let newUser = new users({
                local: {
                    email: email,
                    password: password
                },
                role: 'DOCTOR',
                status: 'ACTIVE'
            });
            // newUser.local.password = newUser.encryptPassword(password);
            newUser.save((err, newUser) => {
                return done(null, newUser);
            });
        }
    });
}));

exports.getSignUp = (req, res) => {
    var message = req.flash('error');
    res.render('signup', {message: message});
}
exports.postSignUp = passport.authenticate('local.signup', {
    successRedirect: '/doctor',
    failureRedirect: '/sign-up',
    failureFlash : true
});

// exports.postSignUp = (req, res) => console.log('post signup')