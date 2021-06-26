const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const config = require('../../config/utils');
const userSchema = new Schema({
    email: { type: String, required: true },
    fullname: { type: String, required: true },
    phonenumber: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: Number, default: new Date().getTime() }
}, { autoIndex: false });
const User = mongoose.model('user', userSchema);
exports.Users = User;
exports.createUser = function (obj) {
    return new Promise((resolve, rejects) => {
        bcrypt.hash(obj.password, config.saltRounds, (err, hash) => {
            if (!err) {
                User.create({
                    email: obj.email,
                    fullname: obj.fullname,
                    phonenumber: obj.phonenumber,
                    password: hash,
                    created_at: new Date().getTime()
                }, (err, rs) => {
                    if (rs) return resolve('đăng ký thành công');
                    else return rejects('đăng ký không thành công');
                })
            } else {
                return rejects('đăng ký không thành công');
            }
        })
    })
}
exports.getAllUser = function(){
    return new Promise((resolve,rejects)=>{
        User.find().exec((err,rs)=>{
            if(rs) return resolve(rs);
            else return rejects('not found account')
        })
    })
}
exports.getUserByEmail = function (email) {
    return new Promise((resolve, rejects) => {
        User.findOne({ email }, (err, rs) => {
            if (rs) return resolve('email đã tồn tại !');
            else return rejects('email có thể sử dụng');
        })
    })
}
exports.getOneUserByEmail = function(email,cb){
    return User.findOne({email},cb);
}
exports.getOneUserById = function(id){
    return new Promise((resolve,rejects)=>{
        User.findById(id,(err,rs)=>{
            if(rs) return resolve(rs);
            else return rejects('user not found');
        })
    })
}