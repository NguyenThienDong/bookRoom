const express = require('express');
var app = express();
const logger = require('morgan');
var mongoose = require('mongoose');
const server = require('http').Server(app);
var io = require('socket.io')(server);
const config = require('./config/utils');
const bcrypt = require('bcryptjs');
var session = require('express-session');


app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var khachsanRouter = require('./api/routes/khachsan')(io,passport,LocalStrategy);
var bodyparser = require('body-parser');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // clickjacking
    res.setHeader('X-Frame-Options', 'sameorigin');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));


mongoose.connect(config.DB, { useNewUrlParser: true }, (err, rs) => {
    if (!err) console.log('connect success DB');
    else console.log('connect fail DB');
});
app.use('/', khachsanRouter);
// server.listen(process.env.PORT || 4001);
server.listen(config.port, () => { console.log('server started !') });