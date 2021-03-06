var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var request = require("request");
var fs = require("fs");


var index = require('./routes/index');
var users = require('./routes/users');
var bangumis = require("./routes/bangumis");
var bangumimoes = require("./routes/bangumimoes");
var musics = require("./routes/musics");
var upload = require("./routes/uploads");
var app = express();

mongoose.connect('mongodb://localhost/anime');

//设置跨域访问
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , x-access-token');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials',true);

    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use("/bangumis",bangumis);
app.use("/musics",musics);
app.use("/bangumimoes",bangumimoes);
app.use("/upload",upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// request({
//     uri:"https://bangumi.moe/api/bangumi/recent",
//     method:"GET",
// },(error,response,body)=>{
//     let bangumimoesList = JSON.parse(body);
//     for(let i=0;i<bangumimoesList.length;i++)
//     {
//         let imgUrl = "https://bangumi.moe/"+bangumimoesList[i].cover;
//         request(imgUrl).pipe(fs.createWriteStream("public/images/bangumimoeCoversTest/"+bangumimoesList[i].cover.split("/")[4])).on("close",()=> {
//             console.log(bangumimoesList[i]);
//         });
//     }
// });




module.exports = app;
