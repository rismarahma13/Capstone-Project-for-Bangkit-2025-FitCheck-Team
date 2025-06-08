// FITCHECK/controllers/authController.js
const User = require("../models/User"); // Impor helper User model
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password, age, gender } = req.body;
  const db = req.db; // Dapatkan pool koneksi database dari request

  if (!name || !email || !password || !age || !gender) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // Cek apakah user sudah ada
  const userExists = await User.findByEmail(db, email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const user = await User.create(db, { name, email, password, age, gender });
    res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
      user: {
        id: user.id, // ID dari MySQL
        name: user.name,
        email: user.email,
      },
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const db = req.db;

  const user = await User.findByEmail(db, email);

  if (user && (await User.matchPassword(password, user.password))) {
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
      },
      token: generateToken(user.id),
    });
  } else {
    res
      .status(401)
      .json({ message: "Invalid credentials (email or password incorrect)" });
  }
};

const getMe = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        age: req.user.age,
        gender: req.user.gender,
      },
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateProfile = async (req, res) => {
  const { name, age, gender } = req.body;
  const db = req.db;

  try {
    const user = await User.findById(db, req.user.id);

    if (user) {
      // Lakukan update melalui helper User model
      await User.update(db, user.id, {
        name: name || user.name,
        age: age || user.age,
        gender: gender || user.gender,
      });

      // Fetch user yang diperbarui untuk memastikan data terbaru dikirim ke frontend
      const updatedUser = await User.findById(db, user.id);

      res.json({
        success: true,
        message: "Profile updated successfully",
        updatedUser: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          age: updatedUser.age,
          gender: updatedUser.gender,
        },
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error during profile update" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
