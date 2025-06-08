// FITCHECK/controllers/bmiController.js
const BmiRecord = require("../models/BmiRecord"); // Impor helper BmiRecord model

const saveBmiRecord = async (req, res) => {
  const { name, age, weight, height, gender, bmi, category, exercise } =
    req.body;
  const userId = req.user.id; // User ID didapatkan dari middleware protect (sekarang ID MySQL)
  const db = req.db; // Dapatkan pool koneksi database dari request

  if (
    !name ||
    !age ||
    !weight ||
    !height ||
    !gender ||
    !bmi ||
    !category ||
    !exercise
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required BMI data" });
  }

  try {
    const newRecord = await BmiRecord.create(db, {
      userId,
      name,
      age,
      weight,
      height,
      gender,
      bmi,
      category,
      exercise,
    });
    res.status(201).json({
      success: true,
      message: "BMI record saved successfully",
      record: newRecord,
    });
  } catch (error) {
    console.error("Error saving BMI record:", error);
    res.status(500).json({ message: "Server error while saving BMI record" });
  }
};

const getBmiHistory = async (req, res) => {
  const userId = req.user.id; // User ID didapatkan dari middleware protect
  const db = req.db;

  try {
    const history = await BmiRecord.findByUserId(db, userId);
    res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("Error fetching BMI history:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching BMI history" });
  }
};

module.exports = {
  saveBmiRecord,
  getBmiHistory,
};
