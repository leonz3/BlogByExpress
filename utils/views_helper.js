
var moment = require('moment');

exports.formatDate = function (date) {
    return moment(date).format('YYYY-MM-DD hh:mm:ss');
};

exports.setDefault = function (currVal, defVal) {
    return currVal ? currVal : defVal;
};

exports.getGender = function(val){
    return parseInt(val) === 1?"男":"女";
};