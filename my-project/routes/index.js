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
 /*if(req.session && req.session.username!=null){
    res.render('goods_add');
  }else{
    res.redirect("/login");
  }*/
router.get('/goods_list', function(req, res, next) {
  GoodsModel.find({sign:1}, function(err, docs) { 
    res.render("goods_list", {list: docs});
  })
})
//删除
router.post('/dele', function(req, res, next) {
    
    var goods_name = req.body.goods_name;
    console.log(goods_name)

   GoodsModel.update({goods_name : goods_name},{$set:{sign:0}},function(err,docs){
       if(!err){
        console.log(docs)
         res.send("删除成功")
       }
   })
   /*db.goods.update({goods_name : "嘻嘻"},{$set:{sign:1}})
   db.goods.remove({sign : 0})
   db.goods.find()*/
})
//模糊查询
router.post("/api/goods_list", function(req, res){
   var val=req.body.val;
  
    GoodsModel.find({goods_name:{$regex:val},sign:1}, function(err, docs) {
     
              res.send(docs);
            })
})
//加载列表
router.post("/api/list", function(req, res){
  var pageNo=req.body.pageNo || 1;
  pageNo=parseInt(pageNo);
  var pageSize=parseInt(req.body.pageSize) || 4;
  GoodsModel.count({sign:1}, function(err, count){
    var pages = Math.ceil(count / pageSize);
    if(pageNo<1){
      pageNo=1;
    }
    if(pageNo>pages){
      pageNo=pages;
    }
    var query =GoodsModel.find({sign:1}).skip((pageNo-1)*pageSize).limit(pageSize).sort({create_date: -1});
    query.exec(function(err,docs){
       var result = {
                count : count,  
                pages: pages,
                data: docs,
                pageNo: pageNo,
                pageSize : pageSize
              }
              res.json(result);
    })
  })
})
//添加商品
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
    gm.sign=1;
    gm.goods_name = goods_name;
    gm.number = number;
    gm.price = price;
    gm.img = imgName;
    gm.img2= imgName2;
    gm.save(function(err){
      if(!err) {
        res.render("goods_list");
        // console.log(goods_name,number,price,imgName,imgName2)
      } else {
        res.send("商品保存失败");
      }
    })
  })
})
//登录
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
              // req.session.username=username;
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
