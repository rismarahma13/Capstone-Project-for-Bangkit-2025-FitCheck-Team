// FITCHECK/routes/bmi.js
const express = require("express");
const router = express.Router();
const {
  saveBmiRecord,
  getBmiHistory,
} = require("../controllers/bmiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/check", protect, saveBmiRecord);
router.get("/history", protect, getBmiHistory);

module.exports = router;
