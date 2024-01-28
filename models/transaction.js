const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    username: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    datetime: { type: Date, required: true }
}, { collection: 'transactions' });

const Transaction = new mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;