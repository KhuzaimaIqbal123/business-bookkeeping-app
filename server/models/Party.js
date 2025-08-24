//server/models/Party.js

const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  itemName: String,
  numberOfItems: Number,
  rate: Number,
  totalBill: Number,      // numberOfItems * rate
  bnam: Number,           // party ko diya gaya amount (maal liya)
  jama: Number,           // party se liya gaya amount (maal diya ya paise liye)
  amount: Number,
  type: {                 // cash ya cheque
    type: String,
    enum: ['cash', 'cheque'],
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  remainingBalance: Number
});

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  entries: [entrySchema]
});

module.exports = mongoose.model('Party', partySchema);
