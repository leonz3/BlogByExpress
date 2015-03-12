var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var util = require('./controllers/util');

var app = express();

//port setup
app.set('port', process.env.PORT || 3000);

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', exphbs({
    extname: 'html',
    defaultLayout: 'layout',
    helpers: util
}));
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/libs')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(util.imgUpload());

app.use(require('./config/session'))
require('./config/router')(app);

app.listen(app.get('port'));

module.exports = app;


