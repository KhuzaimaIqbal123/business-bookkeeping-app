const express = require('express');
const Screenshot = require('../models/Screenshot');
const router = express.Router();

// Save or update screenshot for the day
router.post('/screenshot', async (req, res) => {
  const { date, imageData } = req.body;
  if (!date || !imageData) return res.status(400).send('Missing data');

  try {
    await Screenshot.findOneAndUpdate(
      { date },                                // same date ke document ko update karega
      { imageData, lastUpdated: new Date() },  // update karega
      { upsert: true, new: true }              // agar nai mila to create karega
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Error saving screenshot:', err);
    res.status(500).send('Server error');
  }
});

// Get screenshot by date
router.get('/screenshot/:date', async (req, res) => {
  try {
    const screenshot = await Screenshot.findOne({ date: req.params.date });
    if (!screenshot) return res.status(404).send('Not found');
    res.json(screenshot);
  } catch (err) {
    console.error('Error fetching screenshot:', err);
    res.status(500).send('Server error');
  }
});

// Get all screenshots
router.get('/screenshots', async (req, res) => {
  try {
    const screenshots = await Screenshot.find().sort({ date: -1 });
    res.json(screenshots);
  } catch (err) {
    console.error('Error fetching screenshots:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
