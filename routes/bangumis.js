/**
 * Created by fengxuming on 2017/7/24.
 */
var express = require('express');
var Bangumi = require("../models/bangumi");
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
    if(req.query.playerDay){
        pam.playerDay = req.query.playerDay;
    }

    var query = Bangumi.find(pam).limit(maxSize).skip(offset);
    query.exec(function(err, bangumis) {
        res.json(bangumis);
    });
});
router.post('/', function(req, res, next) {
    var bangumi = new Bangumi(req.body);
    bangumi.dateCreated = Date.now();
    bangumi.validate(function (err) {
        if(err){
            console.log(String(err));
            return res.status(422).send(String(err));
        }else{
            bangumi.save(function(err) {
                res.json(bangumi);
            });
        }
    });

});
router.put('/:id', function(req, res, next) {
    Bangumi.findOne({ _id: req.params.id }, function(err, bangumi) {
        for (prop in req.body) {
            bangumi[prop] = req.body[prop];
        }
        bangumi.validate(function (err) {
            if(err){
                console.log(String(err));
                return res.status(422).send(String(err));
            }else{
                bangumi.save(function(err) {
                    res.json(bangumi);
                });
            }
        });

    });
});
router.get('/:id', function (req, res, next) {
    Bangumi.findOne({ _id: req.params.id}, function(err, bangumi) {
        res.json(bangumi);
    });
});

router.delete('/:id', function (req, res, next) {
    Bangumi.remove({
        _id: req.params.id
    }, function(err, bangumi) {
        res.json('');
    });
});

module.exports = router;