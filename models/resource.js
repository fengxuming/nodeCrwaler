
var mongoose = require('mongoose');
var Schema=mongoose.Schema;
var  mongooseHidden = require('mongoose-hidden')();

var resourceSchema = new Schema({
    name:{type:String,required:true},
    type:String,
    thumb:{type:String,required:true},
    path:{type:String,required:true},
    dateCreated:{type:Date,default:Date.now()}
});

resourceSchema.plugin(mongooseHidden,{ defaultHidden: { __v:true } });

module.exports = mongoose.model('Resource', resourceSchema);