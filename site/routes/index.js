var express = require('express');
var router = express.Router();
var User=require('../database/dbHandel');
var sendMsg = 0;
var msgContent = {show:0,content:"."};

function pushMessage(str){
    msgContent.show = 1;
    msgContent.content = str;
    sendMsg = 1;
}
function sendM(res, mC){
	res.send(mC);
	sendMsg = 0;
	msgContent.show = 0;
	msgContent.content='.';
	res.end();
}
/* GET index page. */
router.route("/").get(function(req, res,next) {
	if(!req.session.user){
		res.render('index', { title: 'Main page' ,rorl:0, u:'/'});
	}else{
		res.render('index', { title: 'Main page' ,rorl:2, u:'/'});
	}
}).post(function(req,res){
	console.log("post /index");
});

/* GET login page. */
router.route("/login").get(function(req,res){    // 到达此路径则渲染login文件，并传出title值供 login.html使用
	res.render('index', { title: 'Main page',rorl:0, u:'/login'});
}).post(function(req,res){ 					   // 从此路径检测到post方式则进行post数据的处理操作

	//get User info
	client = User.connect();  
	result=null;
	var uname = req.body.uname;				//获取post上来的 data数据中 uname的值

	User.selectFun(client,uname, function (result){   //通过此model以用户名的条件 查询数据库中的匹配信息
		if(result[0]===undefined){ 								//查询不到用户名匹配信息，则用户名不存在
			req.session.error = 'Username does not exist!';
			pushMessage("Username does not exist!");
			res.sendStatus(404);							//	状态码返回404
			res.end();
		//	res.redirect("/login");
		}else{ 
			if(req.body.upwd != result[0].password){ 	//查询到匹配用户名的信息，但相应的password属性不匹配
				req.session.error = 'Wrong password!';
				pushMessage("Wrong password!");
				res.sendStatus(404);
				res.end();
			//	res.redirect("/login");
			}else{ 									//信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
				req.session.user = result;
				req.session.islogin=req.body.uname;
                res.locals.islogin=req.session.islogin;
                res.cookie('islogin',res.locals.islogin,{maxAge:60000});
                console.log("login");
                pushMessage("Login Success!");
				res.sendStatus(200);
				res.end();
			//	res.redirect("/home");
			}
		}
	});
	
});

/* GET register page. */
router.route("/register").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
	res.render('index', { title: 'Main page' ,rorl:1, u:'/register'});
}).post(function(req,res){ 

	var uname = req.body.uname;
	var upwd = req.body.upwd;
	client = User.connect();
	result=null;
	User.selectFun(client,uname, function (result){  
		if(result[0]===undefined){ 
			User.insertFun(client,uname ,upwd, function (err){
				console.log(uname);
				if(err) throw err;
				else {
                    req.session.error = 'Success!';
                    pushMessage("Register Success!");
                    res.sendStatus(200);
                    res.end();
                }
        	});
		}else{
			req.session.error = 'Exist';
			pushMessage("Account exist!");
			res.sendStatus(500);
			res.end();
		}
	});
	
});

/* GET home page. */
router.route("/home").get(function(req,res){ 
	if(!req.session.user){
		req.session.error = "Please Login!";
		res.redirect("/");
	}else{
		var uname = req.session.islogin;

		client = User.connect();

		User.selectQues(client,uname, 1,function(result1){
			if(result1.length < 5){
				pushMessage("Already logged in, but need more question!");
				res.redirect("/");
			}else{
				User.selectRe(client, uname, 1, function(result2){
					if(result1.length !=0 && result2.length != 0){
						res.render("home",{title:'Home', cate:result1, data:result2, u:'/home'});         //已登录则渲染home页面
					}else{
						res.redirect("/make");
					}
				});
			}
		});	
	}
}).post(function(req,res){

	if(req.body.delete){
		var uname = req.session.islogin;
		client = User.connect();
		User.deleteQ(client, uname, 1, function(err){
			if(err) throw err;
			else{
				User.deleteR(client, uname, 1, function(err){
					if(err) throw err;
					else{
						pushMessage("Deleted!");
						res.sendStatus(200);
						res.end();
					}
				});
			}
		});
	}

});

/* GET logout page. */
router.get("/logout",function(req,res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
	req.session.user = null;
	req.session.error = null;
	req.session.islogin = null;
    res.locals.islogin = null;
	res.clearCookie('islogin');
	res.redirect("/");
});

		

/* GET make page. */
router.route("/make").get(function(req,res){
	if(!req.session.user){
		res.redirect("/login");
	}else{
		res.render("make",{title:'User Making', u:'/make'});
	}
}).post(function(req,res){ 

	client = User.connect();
	var uname = req.session.islogin;

	User.selectQues(client,uname, 1,function(result){  
		var arr = Object.keys(result);
		if(arr.length < 5){
			User.insertAnsw(client, uname, 1, arr.length, 0,0,0,0, function(err){
				if(err) throw err;
				console.log("insertAnsw");
			});
			User.insertQues(client, uname, 1, arr.length, req.body.ques,
			req.body.option1,req.body.option2,req.body.option3,req.body.option4, function(err){

				if(err) throw err;
				else{
					req.session.error = 'Success';
					pushMessage("Add a new question!");
					res.sendStatus(200);
					res.end();
				}

			});
		} else {
			pushMessage("Enough questions!");
			req.session.error = 'Max';
			res.sendStatus(500);
			res.end();
		}
	});
	
});

/* GET fill page. */
router.route("/fill").get(function(req,res){
	client = User.connect();
	User.selectQues(client, req.session.islogin, 1, function(result){
		var arr = Object.keys(result);
		if(arr.length < 5){
			req.session.error = "need 5 question!";
			pushMessage("Need 5 questions!");
			res.redirect("/make");
		}else{
			res.render("fill",{title:'User Filling', r:result, u:'/fill'});
		}
	});
}).post(function(req,res){ 
	client = User.connect();
	var uname = req.session.islogin;
	for(var i = 1; i <= 5; i++){
		switch(Number(eval('req.body.answ'+i))){
			case 1:
			User.updateOp1(client, uname, req.body.qaid, i-1, function(err){
				if(err) throw err;
			});	
			break;

			case 2:
			User.updateOp2(client, uname, req.body.qaid, i-1, function(err){
				if(err) throw err;
			});	
			break;

			case 3:
			User.updateOp3(client, uname, req.body.qaid, i-1, function(err){
				if(err) throw err;
			});	
			break;

			case 4:
			User.updateOp4(client, uname, req.body.qaid, i-1, function(err){
				if(err) throw err;
			});	
			break;
			default:
			console.log("updateAnsw" + eval('req.body.answ'+i));
		}	
	}
	req.session.error = 'Success';
	pushMessage("Answered!");
	res.sendStatus(200);
	res.end();
});

router.route("/message").post(function(req,res){
	if(req.body.clientMsg == 1){
		console.log(msgContent.content);
		sendM(res, msgContent);
	}else{
		console.log("post:/message");
	}
});

module.exports = router;
