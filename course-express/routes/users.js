var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//创建一个mongo客户端
const MongoClient = require('mongodb').MongoClient;
//自定义的一个mongo连接的url
var DB_CONN_STR = 'mongodb://localhost:27017/test';
//注册
router.post('/register',function(req,res,next) {
	var phone = req.body['phone'];
	var nickName = req.body['nickName'];
	var password = req.body['password'];
	var insertData = function(db){
		//连接到表
		var conn = db.collection('user');
		var data = [{phone: phone,nickName:nickName,password:password}];
		var data2 = {phone: phone};
		//查询
		conn.find(data2).toArray(function(err,results){
			if(err){
				console.log(err);
			}else{
				var length = results.length;
				if(length == 0){
					console.log('用户名不存在');
					conn.insert(data,function(err,results){
						if(err){
							console.log(err);
						}else {
							console.log('插入成功');
							res.redirect('/#/main');
							//关闭连接
							db.close();
						}
					})
					res.send('用户名不存在');

				}else{
					console.log('用户名已存在');
					res.send('用户名已存在');
				}
				db.close();
			}
		});

		
		// conn.insert(data,function(err,results){
		// 	if(err){
		// 		console.log(err);
		// 	}else {
		// 		console.log('插入成功');
		// 		res.redirect('/#/main');
		// 		//关闭连接
		// 		db.close();
		// 	}
		// })
	}
	//连接数据库
	MongoClient.connect(DB_CONN_STR,function(err,db){
		if(err){
			console.log(err);
		}else {
			insertData(db);
		}
	});
});
//登录
router.post('/login',function(req,res,next){
	var phone = req.body['phone'];
	console.log(phone);
	var password = req.body['password'];
	var selectData = function(db){
		//连接到集合
		var conn = db.collection('user');
		var data = {phone: phone};
		//查询
		conn.find(data).toArray(function(err,results){
			if(err){
				console.log(err);
			}else{
				var length = results.length;
				if(length == 0){
					res.send('用户名不存在');
				}else{
					results.forEach(function(value){
						if(password==value.password){
							console.log('密码正确');
							//存储手机号和密码
							req.session.phone = results[0].phone;
							req.session.password = results[0].password;
							//跳到首页/main路由
							res.send('密码正确');
						}else{
							console.log(value.phone);
							console.log(value.password);
							console.log('密码错误');
							res.send('密码错误');
						}
					});
				}
				db.close();
			}
		});

	}
	MongoClient.connect(DB_CONN_STR,function(err,db){
		if(err){
			console.log(err);
		}else{
			selectData(db);
		}
	});
});
module.exports = router;
