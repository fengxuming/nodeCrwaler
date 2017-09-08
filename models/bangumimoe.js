/**
 * Created by fengxuming on 2017/9/8.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bangumimoeSchema = new Schema({
    name:{type:String},
    credit:{type:String},
    showOn:{type:Number},
    cover:{type:String},
    startDate:{type:Date},
    endDate:{type:Date},
    locale:{
        ja:{type:String},
        zh_cn:{type:String},
        zh_tw:{type:String},
        en:{type:String}
    }
});
module.exports = mongoose.model('Bangumimoe', bangumimoeSchema);