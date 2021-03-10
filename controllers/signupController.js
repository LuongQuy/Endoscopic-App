const passport = require('passport');
const localStrategy = require('passport-local');
const users = require('../models/user');
const imageModel = require('../models/image');
const diagnosticModel = require('../models/diagnostic');
const fs = require('fs');
const path = require('path');

async function makeFolder(dir){
    fs.mkdir(dir, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

async function select_img(doctor_id, selected_dates){
    images = await imageModel.find({}, "_id");
    // console.log('images:',images)
    selected_dates = selected_dates.split(',');
    // console.log('selected_dates:',selected_dates)
    images = await imageModel.find({});
    numbers = Array.from(Array(images.length).keys());

    var i;
    var rand;
    for(i = 1; i <= images.length; i++){
        rand = Math.floor(Math.random()*numbers.length);
        idx_img = numbers[rand]
        numbers.splice(rand,1);
        let newDia = new diagnosticModel({
            doctor_id: doctor_id,
            image_id: images[idx_img],
            selected_date: selected_dates[0]
        })
        newDia.save((err,use)=>{if(err) console.log(err)})
        
        if(i % 30 == 0){
            selected_dates.shift()
        }
    }
}

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
                // fullname: req.body.fullname,
                local: {
                    email: email,
                    password: password
                },
                role: 'DOCTOR',
                status: 'ACTIVE'
            });
            // newUser.local.password = newUser.encryptPassword(password);
            newUser.save(async (err, newUser) => {
                if(err) console.log(err)
                else{
                    await select_img(newUser._id, req.body.selected_dates)
                    let dataPath = path.join(__dirname, 'doctor/data/'+email)
                    await makeFolder(dataPath)
                    return done(null, newUser);
                }
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