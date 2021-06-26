const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: {type:String, required:true},
    password: {type:String, required:true}
}, { autoIndex: false });
const Admin = mongoose.model('admin', adminSchema);
exports.Admins = Admin;
exports.createAdmin = function(username ,password){
    return new Promise((resolve,reject)=>{
        Admin.create({
            username,
            password
        },(err,rs)=>{
            if(rs) return resolve('create admin success');
            else return reject('error');
        })
    })
}