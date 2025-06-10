// FITCHECK/models/BmiRecord.js

// Objek BmiRecord akan bertindak sebagai "model" untuk interaksi dengan tabel 'bmirecords' di MySQL.
// Ia menyediakan method-method untuk melakukan operasi CRUD (Create, Read, Update, Delete)
// meskipun di sini kita hanya fokus pada Create (membuat) dan Read (membaca).
const BmiRecord = {
  /**
   * Metode untuk menambahkan (CREATE) catatan BMI baru ke dalam tabel 'bmirecords'.
   *
   * @param {object} db - Objek pool koneksi MySQL. Ini akan dilewatkan dari middleware Express (req.db).
   * @param {object} recordData - Objek yang berisi semua data untuk catatan BMI yang akan disimpan.
   * @param {number} recordData.userId - ID pengguna yang memiliki catatan BMI ini (foreign key ke tabel 'users').
   * @param {string} recordData.name - Nama individu yang dicatat BMI-nya.
   * @param {number} recordData.age - Umur individu.
   * @param {number} recordData.weight - Berat badan dalam kilogram.
   * @param {number} recordData.height - Tinggi badan dalam centimeter.
   * @param {string} recordData.gender - Jenis kelamin.
   * @param {number} recordData.bmi - Nilai Body Mass Index yang sudah dihitung.
   * @param {string} recordData.category - Kategori BMI (contoh: "Normal weight", "Overweight").
   * @param {string} recordData.exercise - Rekomendasi aktivitas/olahraga.
   *
   * @returns {Promise<object>} - Mengembalikan Promise yang akan resolve dengan objek catatan BMI yang baru dibuat,
   * termasuk ID yang di-generate oleh database MySQL.
   * Jika terjadi kesalahan, Promise akan reject.
   */
  create: async (db, recordData) => {
    // Destructuring recordData untuk mendapatkan nilai-nilai yang diperlukan
    const {
      userId,
      name,
      age,
      weight,
      height,
      gender,
      bmi,
      category,
      exercise,
    } = recordData;

    // Query SQL untuk menyisipkan data.
    // Tanda '?' digunakan sebagai placeholder untuk prepared statements.
    // Prepared statements penting untuk keamanan, mencegah SQL Injection.
    const [result] = await db.execute(
      `INSERT INTO bmirecords (userId, name, age, weight, height, gender, bmi, category, exercise) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, age, weight, height, gender, bmi, category, exercise]
    );

    // 'result.insertId' adalah properti yang dikembalikan oleh mysql2/promise
    // yang berisi ID dari baris yang baru saja dimasukkan (jika kolom ID adalah AUTO_INCREMENT).
    // Mengembalikan objek baru yang menggabungkan data yang dimasukkan
    // dengan ID yang di-generate oleh database.
    return { id: result.insertId, ...recordData };
  },

  /**
   * Metode untuk mengambil (READ) semua catatan BMI untuk pengguna tertentu.
   * Catatan akan diurutkan berdasarkan tanggal (kolom 'date') dari yang terbaru ke terlama (DESC).
   *
   * @param {object} db - Pool koneksi MySQL yang didapatkan dari req.db.
   * @param {number} userId - ID pengguna yang catatan BMI-nya ingin diambil.
   *
   * @returns {Promise<Array<object>>} - Mengembalikan Promise yang akan resolve dengan array objek catatan BMI.
   * Array akan kosong jika tidak ada catatan ditemukan.
   * Jika terjadi kesalahan, Promise akan reject.
   */
  findByUserId: async (db, userId) => {
    // Query SQL untuk memilih semua kolom dari tabel 'bmirecords'
    // WHERE userId cocok dengan ID yang diberikan,
    // dan ORDER BY date DESC (terbaru dulu).
    const [rows] = await db.execute(
      "SELECT * FROM bmirecords WHERE userId = ? ORDER BY date DESC",
      [userId]
    );

    // 'rows' adalah array hasil dari query.
    // Mengembalikan array ini. Jika tidak ada hasil, array akan kosong.
    return rows;
  },
};

// Mengekspor objek BmiRecord agar dapat diimpor dan digunakan di file lain (misalnya controllers).
module.exports = BmiRecord;
