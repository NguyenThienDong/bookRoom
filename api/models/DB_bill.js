const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Room = require('./DB_room');
const billSchema = new Schema({
    id_user: { type: Schema.Types.ObjectId, ref: 'user' },
    id_room : {type:Schema.Types.ObjectId, ref:'room'},
    name_KH: {type:String, required:true},
    phonenumber:{type:String, required:true},
    CMTND: {type:String, required:true},
    totalprice: {type:Number, required:true},
    time_start: { type: Number, required: true },
    time_finish: { type: Number, required: true },
    created_at: { type: Number }
}, { autoIndex: false });
const Bill = mongoose.model('bill', billSchema);
exports.Bills = Bill;
exports.getBill = function(){
    return new Promise((resolve,rejects)=>{
        Bill.find()
        .populate({path:'id_room', select:'name image price species'})
        .sort({created_at: 1})
        .exec((err,rs)=>{
            if(rs) return resolve(rs);
            else return rejects('KhÔng có hóa đơn nào !');
        })
    })
}
exports.getBillByIdUser = function(id_user){
    return new Promise((resolve,rejects)=>{
        Bill.find({id_user})
        .populate({path:'id_room', select:'name image price species'})
        .sort({created_at: 1})
        .exec((err,rs)=>{
            if(rs) return resolve(rs);
            else return rejects('Không có hóa đơn nào');
        })
    })
}
exports.deleteBillById = function(id){
    return new Promise((resolve,reject)=>{
        Bill.findById(id).exec( async (err,rs)=>{
            if(rs){
                let setRoomFalse = await Room.setStatusTrue(rs.id_room);
                if(setRoomFalse){
                    Bill.remove({_id:id},(err,rs)=>{
                        if(rs) {
                            return resolve('delete success');
                        }
                        else return reject("Delete fail");
                    })
                }
            }
        })
        
    })
    
}