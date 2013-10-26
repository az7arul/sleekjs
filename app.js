/**
 * Sleek app init
 * Here we iniialize :: Please dont edit :)
 *  
 * @version 1.0
 * @author Robin <robin@cubettech.com>
 * @Date 23-10-2013
 */

var express = require('express');
var http = require('http');
var path = require('path');
var hbs = require('handlebars');
var engines = require('consolidate');
var exphbs  = require('express3-handlebars');
global.app = express();

//get configs
require('./system/core/sleek.js');
app.set('env', sleekConfig.env);

// all environments
app.set('port', process.env.PORT || sleekConfig.appPort);
app.set('views', path.join(__dirname, 'application/views'));
app.set('view engine', 'handlebars');
//app.set("view options", {layout: path.join(__dirname, 'application/views/mylayout.html')});
app.engine('html',  exphbs({defaultLayout: path.join(__dirname, 'application/layouts/default'),
                            layoutsDir: path.join(__dirname, 'application/layouts/'), extname:".html"})
            ); 
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('CubEtNoDeSlEek'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
} 
//get controllers
require('./application/config/routes.js')(app)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
