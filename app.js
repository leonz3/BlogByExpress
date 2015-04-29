
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var viewHelper = require('./utils/htmlHelper');
var upload = require('./utils/upload');

var app = express();

//port setup
app.set('port', process.env.PORT || 3000);

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', exphbs({
    extname: 'html',
    defaultLayout: 'layout',
    helpers: viewHelper
}));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret:'leon',
    resave:false,
    saveUninitialized:false
}));
app.use(upload.upload());

//app.use(require('./config/session'))
require('./config/router')(app);

app.listen(app.get('port'));

module.exports = app;


