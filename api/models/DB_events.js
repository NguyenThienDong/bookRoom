const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true, default: '' },
    description: { type: String, required: true },
    created_at: { type: Number }
},