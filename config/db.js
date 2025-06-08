// FITCHECK/config/db.js
const mysql = require("mysql2/promise"); // Menggunakan promise API untuk async/await

const connectDB = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10, // Jumlah maksimum koneksi dalam pool
      queueLimit: 0, // Batas antrian untuk koneksi
    });

    console.log("MySQL Connected successfully");
    return pool; // Mengembalikan pool koneksi untuk digunakan di aplikasi
  } catch (err) {
    console.error("MySQL connection error:", err.message);
    process.exit(1); // Keluar dari proses Node.js jika koneksi database gagal
  }
};

module.exports = connectDB;
