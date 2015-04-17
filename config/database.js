
var mysql = require('mysql');
var config = require('./config.json');

var pool = mysql.createPool(config.Aliyun);

exports.release = function(conn){
    conn.end(function(err){
        if(err){
            console.log('release connection exception');
            throw err;
        }
    });
};

exports.execute = function(opts){
    return new Promise(function(resolve,reject){
        pool.getConnection(function(err,conn){
            if(err){
                console.log('get connection exception');
                throw err;
            }
            var sql = opts.sql;
            var values = opts.values || [];
            var handler = opts.handler || function(result,resolve,reject){
                    resolve(result);
                };
            var query = conn.query(sql,values,function(err,result){
                if(err){
                    console.log('execute query exception');
                    throw err;
                }
                handler(result,resolve,reject);
            });
            console.log('sql: ' + query.sql);
            conn.release(function(err){
                if(err){
                    console.log('release connection exception');
                    throw err;
                }
            });
        });
    });
};
