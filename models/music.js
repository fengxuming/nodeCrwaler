/**
 * Created by fengxuming on 2017/7/25.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var musicSchema = new Schema({
    musicName:String,
    musicInfo:String
});
module.exports = mongoose.model('Music', musicSchema);