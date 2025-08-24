// server/models/Cheque.js
const mongoose = require('mongoose');

const chequeSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  partyName: { type: String, default: null }, // which party gave this cheque (optional)
  sourceEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry', default: null }, // entry that created this cheque (income)
  status: { type: String, enum: ['available', 'used'], default: 'available' },
  usedInEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'Entry', default: null }, // entry that used this cheque (expense)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cheque', chequeSchema);
