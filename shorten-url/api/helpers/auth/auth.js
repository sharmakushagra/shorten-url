const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../../config/config');

let getHashedpassword = (password) =>{
    return bcrypt.hashSync(password, 8);
}

let createToken = (user) => {
        delete user.password;
        return jwt.sign(user, config.secret, {
                expiresIn: 86400 // expires in 24 hours
        });
}

let verifyToken = async (token) =>{
    jwt.verify(token, config.secret)
        .then(()=> true)
        .catch((err)=> Promise.reject(false));
}

let checkPasswordValidity = async (reqPassword, password) =>{
    return bcrypt.compareSync(reqPassword, password);        
}

module.exports = {
    getHashedpassword,
    createToken,
    verifyToken,
    checkPasswordValidity
}