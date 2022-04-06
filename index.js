const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utilities/ExpressError');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const prepperRoutes = require('./routes/preppers');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const flash = require('connect-flash');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users');

mongoose.connect('mongodb://localhost:27017/leftovers');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected main index')
});

const port = 8080;


app.engine('ejs', engine);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const week = 604800000;  // a week in miliseconds
const sessionConfig = {
    secret: 'thisneedstobearealsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + week,
        maxAge: week 
    }
}

app.use(cookieParser())
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/preppers', prepperRoutes);
app.use('/preppers/:id', reviewRoutes);
app.use('/', userRoutes);



app.get('/', (req, res) => {
    req.session.username = req.query.username;
    const {username ='Anon'} = req.session;
    if(!req.session.views){
         req.session.views = 1;
    } else {
        req.session.views += 1;
    }
    let views = req.session.views;
    res.render('home', { username, views });
})

app.all('*', (err, req, res, next) => {
    next(new ExpressError('something went wrong', 500));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    res.status(status).render('error', {err, status});
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

