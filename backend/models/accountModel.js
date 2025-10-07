const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    id: { type: String,  unique:true, default: () => uuidv4() },
    userId : { type: String, required: true, trim: true },
    accountType: { type: String, required: true },
    balance: { type: Number, default: 0.0 },
})

module.exports = mongoose.model('User', accountSchema);