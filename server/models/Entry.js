// server/models/Entry.js
const mongoose = require('mongoose');

const chequeDetailSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true }
}, { _id: false });

const entrySchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  paymentType: { type: String, enum: ['cash', 'cheque'], required: true },
  category: { type: String, enum: ['party', 'extra'], required: true },
  amount: { type: Number, required: true }, // total amount (sum of cheques when cheque)
  description: { type: String },
  partyName: { type: String, default: null },
  numberOfCheques: { type: Number, default: null },
  chequeDetails: { type: [chequeDetailSchema], default: [] }, // used for income entries (cheques given to us)
  usedChequeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cheque' }], // used when expense uses existing cheques
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entry', entrySchema);
