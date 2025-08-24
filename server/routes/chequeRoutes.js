// server/routes/chequeRoutes.js
const express = require("express");
const router = express.Router();
const Cheque = require("../models/Cheque");

// get all available cheques
router.get("/available", async (req, res) => {
  try {
    const cheques = await Cheque.find({ status: "available" }).sort({ date: 1 });
    res.json(cheques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch available cheques" });
  }
});

module.exports = router;
