// server/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const partyRoutes = require('./routes/partyRoutes');
const screenshotRoutes = require('./routes/roznamchaScreenshotRoutes');
const chequeRoutes = require("./routes/chequeRoutes");


const app = express();
connectDB();

// Enable CORS
app.use(cors());

// Increase request size limits to handle large screenshots
app.use(express.json({ limit: '100mb' }));          // large JSON payloads
app.use(express.urlencoded({ limit: '100mb', extended: true })); // large form data

// Routes
app.use('/api/roznamcha', require('./routes/roznamcha'));
app.use('/api/parties', partyRoutes);
app.use('/api/roznamcha', screenshotRoutes);
app.use("/api/cheques", chequeRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
