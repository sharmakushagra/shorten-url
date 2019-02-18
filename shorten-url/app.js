'use strict';
const dotenv = require('dotenv');
dotenv.load();
//LIBS
var SwaggerRestify = require('swagger-restify-mw');
var restify = require('restify')
var Logger = require('bunyan');
var dbUtils = require('./api/helpers/db/db')
var fs = require('fs');
var _ = require('lodash');
var auth = require('./api/helpers/auth/auth');
var log = new Logger.createLogger({ 
      name: 'url-shorten-service', 
      serializers: { req: Logger.stdSerializers.req } 
  });
    
var app = restify.createServer({ log: log });

var port = process.env.PORT ;

//app configs
app.use(restify.CORS());
app.use(restify.queryParser());
app.use(restify.bodyParser());
//app.use(jwt);
app.pre(function (req, res, next) { 
  req.log.info({ req: req }, 'REQUEST'); 
  next(); 
});

app.listen(port);

//swagger config
var config = {
  appRoot: __dirname,
  swaggerSecurityHandlers: {
    UserSecurity: ()=>{}
      
    // function (req, authOrSecDef, scopesOrApiKey, cb) {
    //   jwt(req, req.res, function(err) {
    //     if (req.user == undefined) {
    //       return cb(new Error('access denied - user does not exist in auth0'));
    //     }
    //     else {
    //       var user = req.user.sub.split("|");
    //       req.userInfo = user;
    //     }
    //   });
    // }
  }
};

dbUtils.initDB();

SwaggerRestify.create(config, function(err, swaggerRestify) {
  if (err) { throw err; }
  swaggerRestify.register(app);
  if (swaggerRestify.runner.swagger.paths['/swagger']) {
    console.log('try this:\ncurl http://127.0.0.1:%d/v2/url-shorten-service/swagger', port);
  }
});

module.exports = app; // for testing
