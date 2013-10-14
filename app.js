
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var exphbs = require('express3-handlebars');

var app = express();
var db = require("./src/db");

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);
app.get('/', function (req, res) {
  res.render('home');
});

app.post('/', require('./routes/index_post.js'));


db.init(function(err) {
    if (err) {
        console.log(err);
    }
    else {
        http.createServer(app).listen(app.get('port'), function(){
          console.log('Express server listening on port ' + app.get('port'));
        });
    }
});