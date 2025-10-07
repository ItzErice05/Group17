const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    id: { type: String, unique: true, default: () => uuidv4() },
    fromAccountId: { type: String, required: true, trim: true },
    toAccountId: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 }, 
    timestamp: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Transaction', transactionSchema);