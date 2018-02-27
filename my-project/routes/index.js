var express = require('express');
var router = express.Router();
var md5 = require("md5");
var UserModel=require("../model/UserModel");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login');
})
router.get('/page', function(req, res, next) {
  res.render('page');
})
router.post("/api/login",function(req,res){
    var username=req.body.username;
    var psw = md5(req.body.psw);
    var result={
      status:1,
      message:"登录成功"
    }
    UserModel.find({username:username,psw:psw},function(err,docs){
       if(!err&&docs.length>0){
                console.log("登录成功");
                res.send(result);
                return;
            }
            console.log("登录失败,请检查您的用户名或者密码"); 
            result.status=-109;
            result.message="登录失败,请检查您的用户名或者密码";
            res.send(result);
    })
})
module.exports = router;
