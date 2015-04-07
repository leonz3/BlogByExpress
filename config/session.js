
var session = require('express-session');
var sessionStore = require('express-mysql-session');
var config = require('./config.json');

module.exports = session({
    secret:'leon',
    store: new sessionStore(config.session),
    cookie: {maxAge: 604800000 },
    resave:false,
    saveUninitialized:true
});
