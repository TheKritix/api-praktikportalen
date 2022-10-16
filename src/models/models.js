const login = require ('./schema/login.js');
const mongoose = require ('mongoose');

const EmployerLogin = mongoose.model("EmployerLogin", login.loginEmployerSchema); 

module.exports = {
    EmployerLogin
};