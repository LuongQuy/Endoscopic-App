const express = require('express');
const bodyParser = require('body-parser');
const config = require('./configs/config');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const doctorRouter = require('./routes/doctor');

const indexController = require('./controllers/indexController');
const imageModel = require('./models/image')

const app = express();
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/doctor', doctorRouter);

app.get('/', (req, res) => {
    return res.render('login')
})

const conn = mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on('connected', function(){
    imageModel.findOne({}, (err, result) => {
        if(!result){
            indexController.addImages();
        }
    })
});

app.listen(config.server_port, () => console.log("Endoscopic Server start on port "+config.server_port))