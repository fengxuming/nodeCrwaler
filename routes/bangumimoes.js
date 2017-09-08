/**
 * Created by fengxuming on 2017/9/8.
 */
var express = require('express');
var Bangumimoe = require("../models/bangumimoe");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var offset = parseInt(req.query.offset || 0);
    var maxSize = parseInt(req.query.maxSize || 20);

    var pam = {};
    if(req.query.bangumiName){
        pam.bangumiName = req.query.bangumiName;
    }
    if(req.query.officialSite){
        pam.officialSite = req.query.officialSite;
    }
    if(req.query.showOn){
        pam.showOn = req.query.showOn;
    }

    var query = Bangumimoe.find(pam).limit(maxSize).skip(offset);
    query.exec(function(err, bangumis) {
        res.json(bangumis);
    });
});
router.post('/', function(req, res, next) {
    var bangumimoe = new Bangumimoe(req.body);
    bangumimoe.dateCreated = Date.now();
    bangumimoe.validate(function (err) {
        if(err){
            console.log(String(err));
            return res.status(422).send(String(err));
        }else{
            bangumimoe.save(function(err,bangumimoe) {
                res.json(bangumimoe);
            });
        }
    });

});
router.put('/:id', function(req, res, next) {
    Bangumimoe.findOne({ _id: req.params.id }, function(err, bangumimoe) {
        for (prop in req.body) {
            bangumimoe[prop] = req.body[prop];
        }
        bangumimoe.validate(function (err) {
            if(err){
                console.log(String(err));
                return res.status(422).send(String(err));
            }else{
                bangumimoe.save(function(err,bangumimoe) {
                    res.json(bangumimoe);
                });
            }
        });

    });
});
router.get('/:id', function (req, res, next) {
    Bangumimoe.findOne({ _id: req.params.id}, function(err, bangumimoe) {
        res.json(bangumi);
    });
});

router.delete('/:id', function (req, res, next) {
    Bangumimoe.remove({
        _id: req.params.id
    }, function(err, bangumi) {
        res.json('');
    });
});

module.exports = router;