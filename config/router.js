var home = require('../controllers/home');
var user = require('../controllers/user');
var article = require('../controllers/article');
var upload = require('../utils/upload');
var checker = require('../filters/checker');

module.exports = function (app) {

    app.get('*',checker.autoLogin)

    /**
     * inde
     x*/
    app.get('/', home.index);
    app.get('/:CategoryId', home.index);
    app.get('/about', home.about);
    app.get('/search/:key', home.search);
    app.get('/page/:category/:index', home.page);

    /**
     * sign
     */
    app.get('/logout', user.logout);
    app.post('/login', user.login);
    app.post('/register', user.register);

    /**
     * user
     * */
    app.get('/u:id', checker.checkTarget, user.center);
    app.get('/u:id/article', checker.checkTarget, user.article);
    app.get('/u:id/article/:index', user.getArticles);
    app.get('/u:id/mood', checker.checkTarget, user.mood);
    app.get('/u:id/mood/:index', user.getMoods);
    app.get('/u:id/info', checker.checkTarget, user.info);
    app.get('/u:id/config', checker.checkTarget, checker.isSelf, user.config);
    app.get('/u:id/collection', checker.checkTarget, checker.isSelf, user.collection);
    app.post('/u:id/config', user.saveConfig);
    app.get('/user/isExists', user.isExistsUser);

    /**
     * aritcle
     * */
    app.get('/a:id', article.detail);
    app.get('/a:id/edit', article.edit);
    app.get('/article/edit', article.edit);
    app.post('/article/save', article.save);
    app.delete('/a:id', article.delete);
    app.post('/article/collect', article.upCollection);
    app.delete('/aricle/collect', article.downCollection);
    app.post('/article/praise', article.upPraise);

    /**
     * comment
     */
    app.post('/comment', article.upComment);
    app.delete('/comment', article.downComment);

    /**
     * mood
     */
    app.post('/mood',user.saveMood);

    /**
     * upload
     */
    app.post('/imgUpload', upload.imgUpload);

    /**
     * catch 404 and forward to handler
     */
    app.use(function (req, res, next) {
        //var err = new Error('Not Found');
        //err.state = 404;
        //next(err);
    });

    /**
     * err handle
     */
    app.use(function (err, req, res) {
        //res.status(err.status || 500);
        //res.render('error', {
        //    message: err.message,
        //    //development or production
        //    error: app.get('env') === 'development' ? err : {}
        //})
    });
}

