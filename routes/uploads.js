var express = require('express');
var router = express.Router();
var Resource = require('../models/resource');
var multer  = require('multer');
var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});
var upload = multer({
    storage: storage
});

var gm = require('gm');

router.post('/', upload.single('file'), function (req, res, next) {
    console.log(__dirname);
    var resource = new Resource();
    resource.dateCreated = Date.now();
    resource.name = req.file.originalname;
    var mimetype = resource.type = req.file.mimetype;
    var filepath = req.file.path;
    var destpath = req.file.destination + "/" + req.file.filename;
    var thumbpath = req.file.destination + "/thumb_" + req.file.filename;
    resource.path = filepath;
    // if(/(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(mimetype)){
    //     gm(destpath).resize(150, '!').write(thumbpath,function (err) {
    //         if (!err) console.log('done');
    //     });
    //     resource.thumb = thumbpath;
    //     console.log(resource.thumb);
    // }
    // resource.validate(function (err) {
    //     if(err){
    //         console.log(String(err));
    //         return res.status(422).send(String(err));
    //     }else{
    //         resource.save(function(err, data) {
    //             if(err){
    //                 console.log(err);
    //             }
    //             res.json(resource);
    //         });
    //     }
    // });
    res.send(filepath);


});

module.exports = router;