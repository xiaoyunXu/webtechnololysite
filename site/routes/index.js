var express = require('express');
var router = express.Router();
var User=require('../database/dbHandel');//handle database, dbHandel.js
var sendMsg = 0;
var msgContent = {show:0,content:"."};

/*Store the message in a global value*/
function pushMessage(str){
    msgContent.show = 1;
    msgContent.content = str;
    sendMsg = 1;
}

/*send message data to client*/
function sendM(res, mC){
	res.send(mC);
	sendMsg = 0;
	msgContent.show = 0;
	msgContent.content='.';
	res.end();
}
/* GET index page. */
router.route("/").get(function(req, res,next){
	if(!req.session.user){
		res.render('index', { title: 'Main page' ,rorl:0, u:'/'});
	}else{
		res.render('index', { title: 'Main page' ,rorl:2, u:'/'});
	}
}).post(function(req,res){
	console.log("post /index");
});

/* Handle login request. */
router.route("/login").get(function(req,res){    
	res.render('index', { title: 'Main page',rorl:0, u:'/login'});
}).post(function(req,res){ 					 
	//get User info
	client = User.connect();  
	result = null;
	var uname = req.body.uname;				//get the data posted from client

	User.selectFun(client,uname, function (result){ //query database if there is a username same as uname.
		if(result[0]===undefined){
			req.session.error = 'Username does not exist!';
			pushMessage("Username does not exist!");
			res.sendStatus(404);//('Not Found')
			res.end();
		//	res.redirect("/login");
		}else{ 
			if(req.body.upwd != result[0].password){		//Found the user but password not right
				req.session.error = 'Wrong password!';
				pushMessage("Wrong password!");
				res.sendStatus(404);//('Not Found')
				res.end();
			//	res.redirect("/login");
			}else{								//Match a user and password, use session and cookie to login.
				req.session.user = result;
				req.session.islogin=req.body.uname;
                res.locals.islogin=req.session.islogin;
                res.cookie('islogin',res.locals.islogin,{maxAge:60000});
                console.log("login");
                pushMessage("Login Success!");
				res.sendStatus(200);//('OK')
				res.end();
			//	res.redirect("/home");
			}
		}
	});
	
});

/* Handle register request */
router.route("/register").get(function(req,res){
	res.render('index', { title: 'Main page' ,rorl:1, u:'/register'});
}).post(function(req,res){ 

	var uname = req.body.uname;
	var upwd = req.body.upwd;
	client = User.connect();
	result=null;
	User.selectFun(client,uname, function (result){		//Ensure that the user name is not repeated
		if(result[0]===undefined){
			User.insertFun(client,uname ,upwd, function (err){
				console.log(uname);
				if(err) throw err;
				else {
                    req.session.error = 'Success!';
                    pushMessage("Register Success!");
                    res.sendStatus(200);//('OK')
                    res.end();
                }
        	});
		}else{
			req.session.error = 'Exist';
			pushMessage("Account exist!");
			res.sendStatus(500);//('Internal Server Error')
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
				var num = 5 - result1.length;
				pushMessage("Already logged in, but need "+num+" more question!");
				res.redirect("/");
			}else{
				User.selectRe(client, uname, 1, function(result2){
					if(result1.length !=0 && result2.length != 0){
						res.render("home",{title:'Home', cate:result1, data:result2, u:'/home'});
					}else{
						res.redirect("/make");
					}
				});
			}
		});	
	}
}).post(function(req,res){
	//delete questions and answer results.
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
						res.sendStatus(200);//('OK')
						res.end();
					}
				});
			}
		});
	}

});

/* GET logout page. */
router.get("/logout",function(req,res){    //logout and redirect to main page "/"
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
					res.sendStatus(200);//('OK')
					res.end();
				}

			});
		} else {
			pushMessage("Enough questions!");
			req.session.error = 'Max';
			res.sendStatus(500);//('Internal Server Error')
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
		switch(Number(eval('req.body.answ'+i))){	//update answer results
			case 1://option1
			User.updateOp1(client, uname, req.body.qaid, i-1, function(err){
				if(err) throw err;
			});	
			break;

			case 2://option2
			User.updateOp2(client, uname, req.body.qaid, i-1, function(err){
				if(err) throw err;
			});	
			break;

			case 3://option3
			User.updateOp3(client, uname, req.body.qaid, i-1, function(err){
				if(err) throw err;
			});	
			break;

			case 4://option4
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
	res.sendStatus(200);//('OK')
	res.end();
});

/*Handle message request*/
router.route("/message").post(function(req,res){
	if(req.body.clientMsg == 1){
		console.log(msgContent.content);
		sendM(res, msgContent);
	}else{
		console.log("post:/message");
	}
});

module.exports = router;
