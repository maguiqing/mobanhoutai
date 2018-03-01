var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// 创建文档的定义
var Goods= new Schema({
	sign:Number,
    goods_name  : String,
    price       : Number,
    number      : String,
    img         :String,
    create_date : { type: Date, default: Date.now }
});

// 创建model对象，与数据库中的文档（表）映射
var GoodsModel = mongoose.model('goods', Goods);

module.exports = GoodsModel;