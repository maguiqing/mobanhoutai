var express = require('express');
var router = express.Router();
var UserModel=require("../model/UserModel");
var GoodsModel = require("../model/GoodsModel");
var multiparty=require("multiparty");
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
router.get('/main', function(req, res, next) {
  res.render('main');
})
router.get('/mainleft', function(req, res, next) {
  res.render('mainleft');
})
router.get('/drag', function(req, res, next) {
  res.render('drag');
})
router.get('/goods_add', function(req, res, next) {
  res.render('goods_add');
})
router.get('/goods_list', function(req, res, next) {
  GoodsModel.find({}, function(err, docs) {
    res.render("goods_list", {list: docs});
  })
})
router.post("/api/add_goods", function(req, res){
  var Form = new multiparty.Form({
    uploadDir: "./public/imgs"
  })
  Form.parse(req, function(err, body, files){
    var goods_name = body.goods_name[0];
    var price = body.price[0];
    var number = body.number[0];
    var imgName = files.img[0].path;
    var imgName2 = files.img2[0].path;
    imgName = imgName.substr(imgName.lastIndexOf("\\") + 1);
    imgName2= imgName2.substr(imgName2.lastIndexOf("\\") + 1);
    var gm = new GoodsModel();
    gm.goods_name = goods_name;
    gm.number = number;
    gm.price = price;
    gm.img = imgName;
    gm.img2= imgName2;
    gm.save(function(err){
      if(!err) {
        res.send("商品保存成功");
        console.log(goods_name,number,price,imgName,imgName2)
      } else {
        res.send("商品保存失败");
      }
    })
  })
})
router.post("/api/login",function(req,res){
    var username=req.body.username;
    var psw = req.body.psw;
    var result={
      status:1,
      message:"登录成功"
    }

    UserModel.find({username:username,psw:psw},function(err,docs){
      console.log(docs)
       if(!err && docs.length>0){
              console.log("登录成功");
              res.send(result);
              
          }else{
              console.log("登录失败,请检查您的用户名或者密码"); 
              result.status=-109;
              result.message="登录失败,请检查您的用户名或者密码";
              res.send(result);
          }
            
    })
})
module.exports = router;
