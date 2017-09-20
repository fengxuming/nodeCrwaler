var express = require('express');
var router = express.Router();
var Promise = require("promise");
var Crawler = require("../node_modules/crawler/lib/crawler");
var request = require("request");
var superagent = require("superagent");
var cheerio = require("../node_modules/cheerio/index");
var Bangumi = require("../models/bangumi");
var Bangumimoe = require("../models/bangumimoe");
var fs = require("fs");
var gm = require("gm");


/* GET home page. */
router.get('/', function(req, res, next) {
    var title ="hello";
    var resTemp = res;

    var c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                // console.log($("#cms-13 script").html());
                var js = $("#cms-13 script").html();
                // var str = "console.log(satarray)";
                var sunarray;
                var monarray;
                var tuearray;
                var wedarray;
                var thuarray;
                var friarray;
                var satarray;
                var longarray;

                eval(js);
                // for(var i=0;i<satarray.length;i++)
                // {
                //     console.log(satarray[i]);
                // }

                resTemp.send(satarray);
                // title = $("title").text();

            }
            done();
        }
    });


// Queue just one URL, with default callback
    c.queue('https://share.dmhy.org/cms/page/name/programme.html');

// Queue a list of URLs
//     c.queue(['http://www.google.com/','http://www.yahoo.com']);

// Queue URLs with custom callbacks & parameters
//     c.queue([{
//         uri: 'http://api.bilibili.com/archive_stat/stat?aid=11300903',
//         jQuery: false,
//
//         // The global callback won't be called
//         callback: function (error, res, done) {
//             if(error){
//                 console.log(error);
//             }else{
//                 var result = JSON.parse(res.body);
//                 console.log(result.data.aid);
//             }
//             done();
//         }
//     }]);

// Queue some HTML code directly without grabbing (mostly for tests)
//     c.queue([{
//         html: '<p>This is a <strong>test</strong></p>'
//     }]);
//         if(flag)
//         {
//             res.send(satarray);
//         }




    // var str;
    // superagent.get("http://www.bilibili.com/video/av11300903/").end(function(err,sres)
    // {
    //     if(err)
    //     {
    //         return next(err);
    //     }
    //     var $ = cheerio.load(sres.text);
    //
    //     str = $("title");
    //     // res.send(sers.text)
    //
    // })
    //
    // superagent.get("http://api.bilibili.com/archive_stat/stat?aid=11300903").end(function(err,sres)
    // {
    //     if(err)
    //     {
    //         return next(err);
    //     }
    //    var obj = JSON.parse(sres.text);
    //
    //     var str = JSON.stringify(obj.data.danmaku);
    //     res.send(str);
    // })



});
router.get('/summerAnime', function(req, res, next) {
    var resTemp = res;
    var c = new Crawler({
        maxConnections : 10,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                var array = [];
                var bangumis = [];

                var len= $("#mw-content-text h2").length;
                $("#mw-content-text h2").each(function (index) {
                    if(index!=0&&index!=1)
                    {
                        var bangumi = new Bangumi();
                        bangumi.bangumiName = $(this).find("span").text();
                        let imgUrl = $(this).next().find("img").attr("src");
                        if(imgUrl!=undefined)
                        {
                            let filename = imgUrl.split("/").pop();
                            console.log(filename);
                            request(imgUrl).pipe(fs.createWriteStream("public/images/bangumiCovers/"+filename));
                            gm("public/images/bangumiCovers/"+filename)
                                .resize(null,200)
                                .autoOrient()
                                .write("public/images/bangumiCovers/"+filename, function (err) {
                                    if (!err) console.log(' hooray! ');
                                });

                            bangumi.cover = "images/bangumiCovers/"+filename;
                        }

                        bangumi.startDate = $(this).next().next().find("dd").eq(1).text();
                        bangumi.playerStationInJapan = $(this).next().next().find("dd").eq(2).text().toString().split("：")[1];
                        bangumi.playerStationInChina = $(this).next().next().find("dd").eq(3).text().toString().split("：")[1];
                        var href = $(this).next().next().next().find("li .external").attr("href");
                        if(href!=undefined)
                        {
                            bangumi.officialSite = href.split("/")[2].replace("www.","");

                        }
                        else
                        {
                            bangumi.officialSite = href;
                        }
                        if( $(this).next().next().next().next().text()=="简介")
                        {
                            bangumi.info = $(this).next().next().next().next().next().find("p").text().split("\n");
                            if($(this).next().next().next().next().next().next().find("span").text()=="STAFF")
                            {
                                bangumi.staff =$(this).next().next().next().next().next().next().next().find("ul").text().split("\n");
                                if($(this).next().next().next().next().next().next().next().next().find("span").text()=="CAST")
                                {
                                    bangumi.cast = $(this).next().next().next().next().next().next().next().next().next().find("ul").text().split("\n");
                                }
                            }
                        }
                        else if($(this).next().next().next().next().text()=="STAFF")
                        {
                            bangumi.staff =$(this).next().next().next().next().next().find("ul").text().split("\n");
                            if($(this).next().next().next().next().next().next().find("span").text()=="CAST")
                            {
                                bangumi.cast = $(this).next().next().next().next().next().next().next().find("ul").text().split("\n");
                            }
                        }
                        else if($(this).next().next().next().next().text()=="CAST")
                        {
                            bangumi.cast = $(this).next().next().next().next().next().find("ul").text().split("\n");
                        }

                        bangumis.push(bangumi);

                        let query = Bangumi.findOne({officialSite:bangumi.officialSite});
                        query.exec(function (err,data) {
                            // console.log(data);
                            if(data==null)
                            {
                                bangumi.save(function (err) {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                })
                            }
                            else
                            {
                                if(data.cover=="hello")
                                {
                                    data.cover = bangumi.cover;
                                }
                                data.save(function (err) {
                                    if(err)
                                    {
                                        console.log(err);
                                    }
                                })
                            }
                        });
                    }
                    if(index==len-1)
                    {
                        resTemp.json(bangumis);
                    }
                });
            }

            done();
        }
    });



// Queue just one URL, with default callback
    c.queue('https://zh.moegirl.org/%E6%97%A5%E6%9C%AC2017%E5%B9%B4%E5%A4%8F%E5%AD%A3%E5%8A%A8%E7%94%BB#');
})
router.get("/huayuan",function (req,res,next) {
    var resTemp = res;
    var c = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                var $ = res.$;
                // $ is Cheerio by default
                //a lean implementation of core jQuery designed specifically for the server
                // console.log($("#cms-13 script").html());
                var js = $("#cms-13 script").html();
                // var str = "console.log(satarray)";

                var sunarray;
                var monarray;
                var tuearray;
                var wedarray;
                var thuarray;
                var friarray;
                var satarray;

                eval(js);
                var bangumiList=[];
                bangumiList.push(sunarray);
                bangumiList.push(monarray);
                bangumiList.push(tuearray);
                bangumiList.push(wedarray);
                bangumiList.push(thuarray);
                bangumiList.push(friarray);
                bangumiList.push(satarray);


                for(var i=0;i<bangumiList.length;i++)
                {
                    for(let n=0;n<bangumiList[i].length;n++)
                    {
                        let bangumiTemp = bangumiList[i][n];
                        bangumiTemp.push(i);
                        let bangumi = new Bangumi();
                        let officialSite = bangumiTemp[4];
                        let imgUrl = bangumiTemp[0];
                        let filename = imgUrl.split("/")[5];
                        if(imgUrl)
                        {
                            imgUrl = imgUrl.replace("http","https");
                            console.log(imgUrl);
                            request(imgUrl).pipe(fs.createWriteStream("public/images/bangumiCovers/"+filename)).on("close",()=>{
                                gm("public/images/bangumiCovers/"+filename)
                                    .resize(null,200)
                                    .autoOrient()
                                    .write("public/images/bangumiCovers/"+filename, function (err) {
                                        if (!err) console.log(' hooray! ');
                                    });
                                officialSite = officialSite.split("/")[2].replace("www.","");
                                let query = Bangumi.findOne({officialSite:officialSite});
                                query.exec(function (err,data) {
                                    // console.log(data);
                                    if(data==null)
                                    {
                                        bangumi.bangumiName=bangumiTemp[1];
                                        bangumi.playerDay = bangumiTemp[5];
                                        bangumi.officialSite = officialSite;
                                        bangumi.cover = "images/bangumiCovers/"+filename;
                                        bangumi.save(function (err) {
                                            if(err)
                                            {
                                                console.log(err);
                                            }
                                        })
                                    }
                                    else
                                    {
                                        data.playerDay = bangumiTemp[5];
                                        data.officialSite = officialSite;
                                        if(data.cover=="hello")
                                        {
                                            data.cover = "images/bangumiCovers/"+filename;
                                        }
                                        data.save(function (err) {
                                            if(err)
                                            {
                                                console.log(err);
                                            }
                                        })
                                    }
                                });
                            });
                        }

                        // request(imgUrl,()=>{
                        //     fs.createWriteStream("public/images/bangumiCovers/"+filename);
                        //
                        //     gm("public/images/bangumiCovers/"+filename)
                        //         .resize(null,200)
                        //         .autoOrient()
                        //         .write("public/images/bangumiCovers/"+filename, function (err) {
                        //             if (!err) console.log(' hooray! ');
                        //         });
                        //     officialSite = officialSite.split("/")[2].replace("www.","");
                        //     let query = Bangumi.findOne({officialSite:officialSite});
                        //     query.exec(function (err,data) {
                        //         // console.log(data);
                        //         if(data==null)
                        //         {
                        //             bangumi.bangumiName=bangumiTemp[1];
                        //             bangumi.playerDay = bangumiTemp[5];
                        //             bangumi.officialSite = officialSite;
                        //             bangumi.cover = "images/bangumiCovers/"+filename;
                        //             bangumi.save(function (err) {
                        //                 if(err)
                        //                 {
                        //                     console.log(err);
                        //                 }
                        //             })
                        //         }
                        //         else
                        //         {
                        //             data.playerDay = bangumiTemp[5];
                        //             data.officialSite = officialSite;
                        //             if(data.cover=="hello")
                        //             {
                        //                 data.cover = "images/bangumiCovers/"+filename;
                        //             }
                        //             data.save(function (err) {
                        //                 if(err)
                        //                 {
                        //                     console.log(err);
                        //                 }
                        //             })
                        //         }
                        //     });
                        // });

                    }
                }

                if(i==bangumiList.length)
                {
                    resTemp.json(bangumiList);
                }
            }
            done();
        }
    });

    // Queue just one URL, with default callback
    c.queue('https://share.dmhy.org/cms/page/name/programme.html');
})
router.get("/bangumimoe",function (req,res,next) {
    let url = "https://bangumi.moe/api/bangumi/recent";
    request({
        uri:url,
        method:"GET"
    },function (error, response, body) {
        if(error)
        {
            console.log(error);
        }
        let bangumimoesRecent = JSON.parse(body);
        let bangumiTagIds = {};
        bangumiTagIds._ids =[];
        for(let i=0;i<bangumimoesRecent.length;i++){
            bangumiTagIds._ids.push(bangumimoesRecent[i].tag_id)
        }
        let url2 = "https://bangumi.moe/api/tag/fetch";
        request({
            uri:url2,
            method:"POST",
            json:true,
            body:bangumiTagIds
        },function (error,response,body) {
            let bangumimoesArray = body;
            let bangumimoesList = [];
            for(let i=0;i<bangumimoesRecent.length;i++)
            {
                for(let n=0;n<bangumimoesArray.length;n++)
                {
                    if(bangumimoesRecent[i].tag_id === bangumimoesArray[n]._id)
                    {
                        let bangumimoe = new Bangumimoe();
                        bangumimoe.name = bangumimoesRecent[i].name;
                        bangumimoe.credit = bangumimoesRecent[i].credit;
                        bangumimoe.startDate = bangumimoesRecent[i].startDate;
                        bangumimoe.endDate = bangumimoesRecent[i].endDate;
                        bangumimoe.showOn = bangumimoesRecent[i].showOn;
                        bangumimoe.locale = bangumimoesArray[n].locale;
                        let imgUrl = "https://bangumi.moe/"+bangumimoesRecent[i].cover;
                        let filename = bangumimoesRecent[i].cover.split("/")[4];
                        bangumimoe.cover = "public/images/bangumimoeCovers/"+filename;

                        request(imgUrl).pipe(fs.createWriteStream("public/images/bangumimoeCovers/"+filename)).on("close",()=> {
                            console.log(bangumimoe);
                        });

                        (function (bangumimoeTemp) {
                            Bangumimoe.findOne({name: bangumimoeTemp.name}, function (err, data) {
                                if (err) {
                                    console.log(err);
                                }
                                if (data) {
                                    data.name = bangumimoeTemp.name;
                                    data.credit = bangumimoeTemp.credit;
                                    data.startDate = bangumimoeTemp.startDate;
                                    data.endDate = bangumimoeTemp.endDate;
                                    data.showOn = bangumimoeTemp.showOn;
                                    data.locale = bangumimoeTemp.locale;
                                    data.cover = bangumimoeTemp.cover;
                                    data.save(function (err,result) {
                                        if(err){
                                            return handleError(err);
                                        }
                                        bangumimoesList.push(result);
                                        if(bangumimoesList.length>=bangumimoesArray.length)
                                        {
                                            res.json(bangumimoesList);
                                        }
                                    })
                                }
                                else {
                                    bangumimoe.save(function (err, bangumimoe) {
                                        if (err) {
                                            console.log(err);
                                        }
                                        bangumimoesList.push(bangumimoe);
                                        if(bangumimoesList.length>=bangumimoesArray.length)
                                        {
                                            res.json(bangumimoesList);
                                        }
                                    })
                                }
                            })
                        })(bangumimoe)


                    }
                }
            }
        })
    });
});
router.get('/test', function(req, res, next) {
    // request("http://share.dmhy.org/images/weekly/knights-magic.gif").pipe(fs.createWriteStream("public/" + "knights-magic.gif")).on("close",function () {
    //     res.send("hello");
    // })

    request("https://share.dmhy.org/images/weekly/knights-magic.gif",function () {
        fs.createWriteStream("public/"+"test2.gif");
    }).on("close",function () {
        res.send("hello");
    });


});
router.get("/bangumimoeImg",function (req,res,next) {
    request({
        uri:"https://bangumi.moe/api/bangumi/recent",
        method:"GET",
    },(error,response,body)=>{
        let bangumimoesList = JSON.parse(body);
        for(let i=0;i<bangumimoesList.length;i++)
        {
            let imgUrl = "https://bangumi.moe/"+bangumimoesList[i].cover;
            request(imgUrl).pipe(fs.createWriteStream("public/images/bangumimoeCoversTest/"+bangumimoesList[i].cover.split("/")[4])).on("close",()=> {
                console.log(bangumimoesList[i]);
            });
        }
    });


})
module.exports = router;
