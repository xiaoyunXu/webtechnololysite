var mysql=require('mysql');

function connectServer(){

    var client=mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'123456',
        database:'ques'
    })

    return client;
}

//login and register
function  selectFun(client,username,callback){
    //client为一个mysql连接对象
    client.query('select password from table_1 where username="'+username+'"',function(err,results,fields){
        if(err) throw err;

        callback(results);
    });
}

//login and register
function insertFun(client , username , password,callback){
    client.query('insert into table_1 value(?,?)', [username, password], function(err,result){
        if( err ){
            console.log( "error:" + err.message);
            return err;
        }
        callback(err);
    });
}

//questionaire
function selectQues(client, username, qaid, callback){
    client.query('select * from table_2 where username="'+username+'" and qa_id="'+qaid+'"', function(err,results,fields){
        if(err) throw err;
        callback(results);
    });
}

//questionaire
function insertQues(client, username, qa_id, q_id, question, option1, option2, option3, option4, callback){
    client.query('insert into table_2 value(?,?,?,?,?,?,?,?)', [username, qa_id, q_id, question, option1, option2, option3, option4],function(err,result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(err);
    });
}
function insertAnsw(client, username, qa_id, q_id, option1, option2, option3, option4, callback){
    client.query('insert into table_3 value(?,?,?,?,?,?,?)', [username, qa_id, q_id, option1, option2, option3, option4],function(err,result){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(err);
    });
}

function updateOp1(client, username, qa_id, q_id, callback){
    client.query('update table_3 set option1 = option1 + 1 where username = "'+username+'" and qa_id = "'+qa_id+'" and q_id ="'+q_id+'"', function(err, results){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(err);
    });
}
function updateOp2(client, username, qa_id, q_id, callback){
    client.query('update table_3 set option2 = option2 + 1 where username = "'+username+'" and qa_id = "'+qa_id+'" and q_id ="'+q_id+'"', function(err, results){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(err);
    });
}
function updateOp3(client, username, qa_id, q_id, callback){
    client.query('update table_3 set option3 = option3 + 1 where username = "'+username+'" and qa_id = "'+qa_id+'" and q_id ="'+q_id+'"', function(err, results){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(err);
    });
}
function updateOp4(client, username, qa_id, q_id, callback){
    client.query('update table_3 set option4 = option4 + 1 where username = "'+username+'" and qa_id = "'+qa_id+'" and q_id ="'+q_id+'"', function(err, results){
        if(err){
            console.log("error:" + err.message);
            return err;
        }
        callback(err);
    });
}

function selectRe(client,username, qa_id,callback){
    client.query('select * from table_3 where username = "'+username+'" and qa_id = "'+qa_id+'"', function(err,results,fields){
        if(err) throw err;

        callback(results);
    });
}

exports.connect = connectServer;
exports.selectFun  = selectFun;
exports.insertFun = insertFun;
exports.selectQues = selectQues;
exports.insertQues = insertQues;
exports.insertAnsw = insertAnsw;
exports.updateOp1 = updateOp1;
exports.updateOp2 = updateOp2;
exports.updateOp3 = updateOp3;
exports.updateOp4 = updateOp4;
exports.selectRe = selectRe;

