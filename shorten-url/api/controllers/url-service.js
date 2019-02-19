'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
const Url = require('../domain/url');

const Logger = require('bunyan');

const log = new Logger.createLogger({
    name: 'url-shorten-controllers',
    serializers: { req: Logger.stdSerializers.req }
});

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */

//To create a User
const userSignup = (req, res) => {
    // variables defined in th,e Swagger document can be referenced using req.swagger.params.{parameter_name}
    let user = req.swagger.params.body.value;
    Url.userSignup(user)
      .then(resp=>{
        res.set('Content-Type', 'application/json');
        res.json(resp);
      })
      .catch(err=>{
        res.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err));
      }) 
}

const userLogin = (req, res) => {
  let {userName, password} = req.swagger.params.body.value;
    Url.userLogin(userName, password)
      .then(resp=>{
        res.set('Content-Type', 'application/json');
        res.json(resp);
      })
      .catch(err=>{
        res.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err));
      })
}

const createShortUrl = (req, res) => {
  let {originalUrl} = req.swagger.params.body.value;
  let userId = req.swagger.params.userId.value;

    Url.createShortUrl(userId, originalUrl)
      .then(resp=>{
        res.set('Content-Type', 'application/json');
        res.json(resp);
      })
      .catch(err=>{
        res.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err));
      })
}

const redirectToUrl = (req, res, next) => {
  let shortId = req.swagger.params.shortId.value;
    Url.redirectUrl(shortId)
      .then(resp=>{
        res.set('Content-Type', 'application/json');
        res.redirect(resp, next);
      })
      .catch(err=>{
        res.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err));
      })
}

const getUrlForUser = (req, res) => {
  let userId = req.swagger.params.userId.value;
  Url.getUrlForUser(userId)
      .then(resp=>{
        res.set('Content-Type', 'application/json');
        res.json(resp);
      })
      .catch(err=>{
        res.writeHead(err.statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(err));
      })
}

module.exports = {
  userSignup, 
  userLogin,
  createShortUrl,
  redirectToUrl,
  getUrlForUser
};