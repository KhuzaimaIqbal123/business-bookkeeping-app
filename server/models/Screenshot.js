const mongoose = require('mongoose');

const ScreenshotSchema = new mongoose.Schema({
  date: { type: String, required: true },   // ❌ "unique: true" hata diya
  imageData: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Screenshot', ScreenshotSchema);
