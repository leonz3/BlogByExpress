var moment = require('moment');

exports.formatDate = function (date) {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
};

exports.setDefault = function (currVal, defVal) {
    return currVal ? currVal : defVal;
};

exports.judge = function(val, on, off){
    var off = off || '';
    return !!val ? on : off;
};

exports.getGender = function (val) {
    return parseInt(val) === 1 ? '男' : '女';
};

exports.bindGender = function (val, gender) {
    return parseInt(val) === gender ? 'checked': '';
};
