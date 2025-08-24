const mongoose = require('mongoose'); 
const capitalSchema = new mongoose.Schema({
   currentCapital: { 
    type: Number,
     required: true }, 
     lastUpdatedDate: {   // to check if already updated today
      type: String, //format: YYYY-MM-DD 
      required: true } },
       { timestamps: true });
       
module.exports = mongoose.model('Capital', capitalSchema);