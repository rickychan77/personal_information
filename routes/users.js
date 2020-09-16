var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../db/DBConfig.js');
var userSQL = require('../db/Usersql.js');
var urllib = require('url');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
var responseJSON = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200', msg: '操作失败'
    });
  } else {
    res.json(ret);
  }
};
// 添加用户
router.get('/addUser', function (req, res, next) {
  // 从连接池获取连接 
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    var param = req.query || req.params;
    var _callback = req.query.callback;
    if(param.name == 0 || param.sex == 0 || param.age == 0 || param.tel == 0){
      var hh = {
        code: 400,
        msg: '增加失败'
      };
      if (_callback) {
        res.type('text/javascript');
        var str = _callback + '(' + JSON.stringify(hh) + ')';//jsonp
        res.send(str);
      } else {
        res.json(hh);
      }
    }else{
      // 建立连接 增加一个用户信息
      connection.query(userSQL.insert, [param.name,param.sex,param.age,param.tel], function (err, result) {
        var hh = {
          code: 200,
          msg: '增加成功'
        };
        if (_callback) {
          res.type('text/javascript');
          var str = _callback + '(' + JSON.stringify(hh) + ')';//jsonp
          res.send(str);
        } else {
          res.json(hh);
        } 
        // 释放连接  
        connection.release();
      });
    }
  });
});

// 查询
router.get('/selectAll', function (req, res, next) {
  // 从连接池获取连接
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    var param = req.query || req.params;
    // 建立连接 增加一个用户信息
    connection.query(userSQL.queryAll, function (err,rows, result) {
      var _callback = req.query.callback;
      var hh = {
        res: 0,
        msg: '查询成功',
        rows: rows
      };
      if (_callback) {
        res.type('text/javascript');
        var str = _callback + '(' + JSON.stringify(hh) + ')';//jsonp
        res.send(str);
      } else {
        res.json(hh);
      }
      connection.release();
    });
  });
});

// 修改用户
router.get('/updateUser', function (req, res, next) {
  // 从连接池获取连接
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    var param = req.query || req.params;
    var _callback = req.query.callback;
    if(param.name == 0 || param.sex == 0 || param.age == 0 || param.tel == 0){
      var hh = {
        code: 400,
        msg: '修改失败'
      };
      if (_callback) {
        res.type('text/javascript');
        var str = _callback + '(' + JSON.stringify(hh) + ')';//jsonp
        res.send(str);
      } else {
        res.json(hh);
      }
    }else{
      connection.query(userSQL.upDated, [param.name,param.sex,param.age,param.tel,param.id], function (err, result) {
        var hh = {
          code: 200,
          msg: '修改成功'
        };
        if (_callback) {
          res.type('text/javascript');
          var str = _callback + '(' + JSON.stringify(hh) + ')';//jsonp
          res.send(str);
        } else {
          res.json(hh);
        }
        connection.release();
      });
    }
  });
});

// 删除用户
router.get('/deleteUser', function (req, res, next) {
  // 从连接池获取连接
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    var param = req.query || req.params;
    var _callback = req.query.callback;
    connection.query(userSQL.delete, [param.id], function (err, result) {
      var hh = {
        code: 200,
        msg: '删除成功'
      };
      if (_callback) {
        res.type('text/javascript');
        var str = _callback + '(' + JSON.stringify(hh) + ')';//jsonp
        res.send(str);
      } else {
        res.json(hh);
      }
      connection.release();
    });
  });
});

// vue登录
router.get('/login', function (req, res, next) {
  // 从连接池获取连接
  pool.getConnection(function (err, connection) {
    // 获取前台页面传过来的参数
    var param = req.query || req.params;
    var _callback = req.query.callback;
      connection.query(userSQL.checkLogin, [param.username,param.password], function (err, result) {
        console.log(result);
        if(result == ''){
          var hh = {
            code: 2,
            msg: '用户不存在！'
          };
        }else{
          if(result[0].password != param.password){
            var hh = {
              code: 1,
              msg: '密码错误'
            };
          }else{
            var hh = {
              code: 0,
              msg: '登录成功！'
            };
          }
        }
        if (_callback) {
          res.type('text/javascript');
          var str = _callback + '(' + JSON.stringify(hh) + ')';//jsonp
          res.send(str);
        } else {
          res.json(hh);
        }
        connection.release();
      });
    // }
  });
});

module.exports = router;