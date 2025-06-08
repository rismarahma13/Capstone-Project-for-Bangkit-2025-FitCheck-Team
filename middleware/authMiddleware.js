// FITCHECK/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Impor helper User model (bukan Mongoose model lagi)

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Dapatkan user dari database menggunakan ID dari token dan pool koneksi dari request
      // req.db tersedia karena middleware di app.js yang menambahkan pool koneksi ke request
      req.user = await User.findById(req.db, decoded.id);

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next(); // Lanjutkan ke handler rute jika otentikasi berhasil
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
