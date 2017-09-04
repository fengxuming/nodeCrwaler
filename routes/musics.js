/**
 * Created by fengxuming on 2017/7/24.
 */
var express = require('express');
var Music = require("../models/music");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
   Music.find(function (err,data) {
       if(err)
       {
           console.log("err:",err);
       }
       res.json(data);
   })
});
router.post('/', function(req, res, next) {
    var music = new Music(req.body);
    music.validate(function (err) {
        if(err){
            console.log(String(err));
            return res.status(422).send(String(err));
        }else{
            music.save(function(err) {
                res.json(music);
            });
        }
    });

});

module.exports = router;