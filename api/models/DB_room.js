const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true, default: '' },
    price: { type: Number, required: true },
    species: { type: Number, required: true },
    description: { type: String, required: true },
    feedback: [{ type: Schema.Types.ObjectId, ref: 'feedback' }],
    status: { type: Boolean, default: true },
    created_at: { type: Number }
}, { autoIndex: false });
const Room = mongoose.model('room', roomSchema);
exports.Rooms = Room;
exports.deleteRoomById = function (id) {
    return new Promise((resolve, reject) => {
        Room.findById(id).exec(async (err, rs) => {
            if (rs) {
                Room.remove({ _id: id }, (err, rs) => {
                    if (rs) {
                        return resolve('delete success');
                    }
                    else return reject("Delete fail");
                })
            }
        })

    })
}
exports.setStatusFalse = function (id) {
    return new Promise((resolve, rejects) => {
        Room.updateOne({ _id: id }, { status: false }, (err, rs) => {
            if (rs) return resolve(true);
            else return resolve(false);
        })
    })
}
exports.setStatusTrue = function (id) {
    return new Promise((resolve, rejects) => {
        Room.updateOne({ _id: id }, { status: true }, (err, rs) => {
            if (rs) return resolve(true);
            else return resolve(false);
        })
    })
}
exports.selectedRoom = function () {
    return new Promise((resolve, rejects) => {
        Room.find({ status: false }).exec((err, rs) => {
            if (rs) return resolve(rs);
            else return rejects('not found');
        })
    })
}
exports.emptyRoom = function () {
    return new Promise((resolve, rejects) => {
        Room.find({ status: true }).exec((err, rs) => {
            if (rs) return resolve(rs);
            else return rejects('not found');
        })
    })
}
exports.createRoom = function (room) {
    return new Promise((resolve, rejects) => {
        Room.create({
            name: room.name,
            image: room.image,
            price: room.price,
            description: room.description,
            species: room.species,
            feedback: [],
            created_at: new Date().getTime()
        }, (err, rs) => {
            if (rs) return resolve(rs);
            else return rejects('create Room fail !');
        })
    })
}
exports.getRoomById = function (id) {
    return new Promise((resolve, rejects) => {
        Room.findById(id, (err, rs) => {
            if (rs) return resolve(rs);
            else return rejects('room not found ')
        })
    })
}
exports.getVipRoom = function () {
    return new Promise((resolve, rejects) => {
        Room.find({ species: 3, status: true }).exec((err, rs) => {
            if (rs) return resolve(rs);
            else return rejects('Vip Room not found');
        })
    })
}
exports.getDoubleRoom = function () {
    return new Promise((resolve, rejects) => {
        Room.find({ species: 2, status: true }).exec((err, rs) => {
            if (rs) return resolve(rs);
            else return rejects('Double Room not found');
        })
    })
}
exports.getSingleRoom = function () {
    return new Promise((resolve, rejects) => {
        Room.find({ species: 1, status: true }).exec((err, rs) => {
            if (rs) return resolve(rs);
            else return rejects('single Room not found');
        })
    })
}
