var home = require('../controllers/home');
var user = require('../controllers/user');
var article = require('../controllers/article');
var upload = require('../utils/upload');
var checker = require('../filters/checker');

module.exports = function (app) {

    app.get(/^\/(?!logout|comment|user|all|(\d+\/\d+))[a-z0-9]*(\/[a-z0-9]+)?$/, checker.autoLogin);

    /**
     * index
     */
    app.get('/:category?/:index?', home.index);
    app.get('/search/:keyword/:index?', home.search);
    app.get('/about', home.about);

    /**
     * sign
     */
    app.get('/logout', user.logout);
    app.post('/login', user.login);
    app.post('/register', user.register);

    /**
     * user
     */
    app.get(/^\/u\d+(\/[a-z]+)?$/, checker.checkTarget, checker.isSelf);
    app.get('/u:id', user.center);
    app.get('/u:id/info', user.info);
    app.get('/u:id/config', user.config);
    app.get('/u:id/mood/:index?', user.mood);
    app.get('/u:id/article/:index?', user.article);
    app.get('/u:id/collection/:index?', user.collection);
    app.get('/user/isExists', user.isExistsUser);
    app.post('/u:id/config', user.saveConfig);
    app.post('/u:id/password', user.updatePassword);

    /**
     * aritcle
     */
    app.get('/a:id', article.detail);
    app.get(['/a:id/edit','/article/edit'], article.edit);
    app.post('/article/save', article.save);
    app.post('/article/praise', article.upPraise);
    app.post('/article/collect', article.upCollection);
    app.delete('/aricle/collect', article.downCollection);
    app.delete('/a:id', article.delete);

    /**
     * comment
     */
    app.get('/comment/:aid/:index', article.getComment);
    app.post('/comment', article.upComment);
    app.delete('/comment', article.downComment);

    /**
     * mood
     */
    app.post('/mood', user.saveMood);

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
        //});
    });
}

