const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true, default: '' },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    feedback: [{ type: Schema.Types.ObjectId, ref: 'feedback' }],
    created_at: { type: Number }
},