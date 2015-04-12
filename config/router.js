
var home = require('../controllers/home');
var user = require('../controllers/user');
var article = require('../controllers/article');
var upload = require('../controllers/upload');
var checker = require('../filters/checker');

module.exports = function (app) {

    //index
    app.get('/', checker.autoLogin,home.index);
    app.get('/:CategoryId', home.index);
    app.get('/about', home.about);
    app.get('/search/:key',home.search);
    app.get('/page/:category/:index',home.page);

    //log & regist
    app.get('/logout', user.logout);
    app.post('/login', user.login);
    app.post('/regist', user.regist);

    //user
    app.get('/u:id', checker.checkTarget, user.center);
    app.get('/u:id/article', checker.checkTarget, user.article);
    app.get('/u:id/mood', checker.checkTarget, user.mood);
    app.get('/u:id/info', checker.checkTarget, user.info);
    app.get('/u:id/config', checker.checkTarget, user.config);
    app.get('/u:id/collection', checker.checkTarget,checker.isSelf,user.collection);

    //aritcle
    app.get('/a:id', article.detail);
    app.get('/a:id/edit', article.edit);
    app.get('/article/edit', article.edit);
    app.post('/article/save', article.save);
    app.delete('/a:id',article.delete);
    app.post('/article/collect',article.upCollection);
    app.delete('/aricle/collect',article.downCollection);
    app.post('/article/praise',article.upPraise);
    app.post('/comment',article.upComment);
    app.delete('/comment',article.downComment);

    //upload
    app.post('/kindUpload', upload.kindUpload);

    //catch 404 and forward to handler
    app.use(function (req, res, next) {
        //var err = new Error('Not Found');
        //err.state = 404;
        //next(err);
    });
    //err handle
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            //development or production
            error: app.get('env') === 'development' ? err : {}
        })
    });
}

