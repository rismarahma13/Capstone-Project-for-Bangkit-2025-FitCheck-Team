// server/config/database.js
const { Sequelize } = require("sequelize");
// const config = require('./config.json'); // Hapus baris ini karena tidak ada config.json

const env = process.env.NODE_ENV || "development"; // Dapatkan environment (default 'development')
let dbConfig; // Variabel untuk menyimpan konfigurasi DB yang akan digunakan

// Konfigurasi untuk lingkungan development (lokal) dan production (Render.com)
// Kredensial database akan selalu diambil dari Environment Variables
dbConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql", // Dialek database yang digunakan
  port: process.env.DB_PORT || 3306, // Port database (ambil dari env atau default 3306)
  define: {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
    underscored: true, // Menggunakan snake_case untuk nama kolom (misal: created_at)
  },
  logging: env === "development", // Aktifkan logging SQL hanya di development
};

// Inisialisasi instance Sequelize
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    port: dbConfig.port,
    define: dbConfig.define,
    logging: dbConfig.logging,
    // Opsi tambahan untuk koneksi, jika diperlukan (misalnya SSL untuk beberapa provider hosting)
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false // Gunakan ini HANYA jika Anda tahu apa yang Anda lakukan dan diuji
    //   }
    // }
  }
);

// Fungsi untuk melakukan autentikasi koneksi ke database
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // Coba koneksi
    console.log("MySQL Connected successfully"); // Pesan sukses
  } catch (error) {
    console.error(
      `Failed to start server due to database connection error: ${error.message}`
    );
    process.exit(1); // Keluar dari aplikasi jika koneksi gagal
  }
};

module.exports = { sequelize, connectDB }; // Ekspor instance sequelize dan fungsi connectDB
