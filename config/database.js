
var mysql = require('mysql');
var config = require('./mysql_config.json');

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
    pool.getConnection(function(err,conn){
       if(err){
           console.log('get connection exception');
           throw err;
       }
        var sql = opts.sql;
        var values = opts.values;
        var handler = opts.handler;
        if(!values){
            var query = conn.query(sql,function(err,result){
                if(err){
                    console.log('execute query exception');
                    throw err;
                }
                handler(result);
            });
            console.log('sql: ' + query.sql);
        }else{
            var query = conn.query(sql,values,function(err,result){
                if(err){
                    console.log('execute query exception');
                    throw err;
                }
                handler(result);
            });
            console.log('sql: ' + query.sql);
        }
        conn.release(function(err){
            if(err){
                console.log('release connection exception');
                throw err;
            }
        });
    });
}

