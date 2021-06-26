const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    id_user: { type: Schema.Types.ObjectId, ref: 'user' },
    id_room: { type: Schema.Types.ObjectId, ref: 'room' },
    content: { type: String, required: true },
    created_at: { type: Number, required: true }
}, { autoIndex: false });
const FeedBack = mongoose.model('feedback', feedbackSchema);
exports.FeedBacks = FeedBack;
exports.createFeedBack = function(id_room,id_user,content){
    return new Promise((resolve,reject)=>{
            if(content==""){
                return resolve(404);
            }
            FeedBack.create({
                id_user,
                id_room,
                content,
                created_at: new Date().getTime()
            },(err,rs)=>{
                if(rs) return resolve(200);
                else return reject('fail');
            })
    })
}