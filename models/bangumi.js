var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var bangumiSchema = new Schema({
    bangumiName:{type:String},
    startDate:{type:String},
    playerStationInJapan:{type:String},
    playerStationInChina:{type:String},
    officialSite:{type:String},
    info:[{type:String}],
    staff:[{type:String}],
    cast:[{type:String}],
    dateCreated:{type:Date,default:Date.now()},
    playerDay:{type:Number,default:-1},
    cover:{type:String,default:"hello"}
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
module.exports = mongoose.model('Bangumi', bangumiSchema); //	与users集合关联