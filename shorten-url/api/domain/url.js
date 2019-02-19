const auth = require('../helpers/auth/auth');
var short = require('short-uuid');

var dbconfig = require('../../config/db');
var rdb = require('rethinkdbdash')({
    pool: true,
    cursor: false,
    port: dbconfig.rethinkdb.port,
    host: dbconfig.rethinkdb.host,
    db: dbconfig.rethinkdb.db,
    buffer: process.env.RDB_MIN || 50,
    max: process.env.RDB_MAX || 1000
});

const userSignup = (user) =>{
    return new Promise((resolve,reject)=>{
        let errResponse = {
            message: "Could not create new user",
            errorCode: "url-shorten-service_1",
            statusCode: 500
        }
        user.password = auth.getHashedpassword(user.password);
        rdb.table("users").filter((rdb.row("userName").eq(user.userName)).or(rdb.row("email").eq(user.email))).run()
            .then((users)=>{
                errResponse = {
                    message: "User with username/email already exist",
                    errorCode: "url-shorten-service_1",
                    statusCode: 403
                }
                if(users.length>0)
                    return reject(errResponse);
                let userId = short.generate();
                user.userId = userId;
                rdb.table("users").insert(user).run()
                    .then(resp => {
                        resolve({userId});            
                    })
                    .catch(err =>{
                        return reject(errResponse);
                    })
            })
            .catch((err)=> {
                reject(errResponse)
            });
        
    })
    
}


const userLogin = (userName, reqPassword) =>{
    return new Promise((resolve, reject)=>{
        var response;
        rdb.table("users").filter({userName: userName}).run()
            .then(user => {
                if(user.length>0){
                    auth.checkPasswordValidity(reqPassword, user[0].password)
                        .then((flag)=>{
                            if(!flag){
                                response = {
                                    message: "Password is invalid",
                                    errorCode: "url-shorten-service_2",
                                    statusCode: 403            
                                }
                                return reject(response);
                            }
                            let token = auth.createToken(user[0]);
                            resolve({token})
                        })                        
                }            
            })
            .catch(err =>{
                response = {
                    message: "Username is invalid",
                    errorCode: "url-shorten-service_3",
                    statusCode: 403
                }
                reject(response);
            })
    })
}

const createShortUrl = (userId, originalUrl) =>{
    return new Promise((resolve,reject)=>{
        let response;
        let shortId = short.generate();
        let mapObj = {
            shortId,
            userId,
            originalUrl
        }
        rdb.table("url_maps").insert(mapObj).run()
            .then((resp)=>{
                resolve({url: `http://localhost:${process.env.PORT}/v2/url/${shortId}`});
            })
            .catch((err)=>{
                response = {
                    message: "Could not generate url",
                    errorCode: "url-shorten-service_4",
                    statusCode: 500
                }
                reject(response);
            })
    })
}

const redirectUrl = (shortId) =>{
    return new Promise((resolve,reject)=>{
        var response = {
            message: "No url for this id.",
            statusCode: 404,
            errorCode: "url-shorten-service_5"
        }
        rdb.table("url_maps").get(shortId).run()
            .then((item)=>{
                if(item.hasOwnProperty("originalUrl"))
                    return resolve(item.originalUrl);
                else{
                    reject(response);
                }
            })
            .catch(err=>{
                reject(response);
            })
    })
}

const getUrlForUser = (userId) =>{
    return new Promise((resolve,reject)=>{
        rdb.table("url_maps").filter({userId}).run()
            .then((resp)=>{
                resolve(resp);
            })
            .catch((err)=>{
                let response = {
                    message: "Could not get all url",
                    errorCode: "url-shorten-service_6",
                    statusCode: 500
                }
                reject(response);
            })
    })
}

module.exports = {
    userSignup,
    userLogin,
    createShortUrl,
    redirectUrl,
    getUrlForUser
}