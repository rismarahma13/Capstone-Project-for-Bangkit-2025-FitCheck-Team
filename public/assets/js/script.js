// FITCHECK/public/assets/js/script.js

// ===========================================
// Global Variables and Initial Setup
// ===========================================
let currentUser = null; // Menyimpan data user yang sedang login
let model = null; // Variabel untuk menyimpan model TensorFlow.js

// API Base URL - Sesuaikan jika server Express berjalan di port/host lain
// Pastikan ini sesuai dengan port yang Anda gunakan di server/app.js (default 3000)
const API_BASE_URL = "http://localhost:3000/api";

// Definisi Kategori BMI
const bmiCategories = [
  "Underweight", // BMI < 18.5
  "Normal weight", // 18.5 <= BMI < 25
  "Overweight", // 25 <= BMI < 30
  "Obesity Class I", // 30 <= BMI < 35
  "Obesity Class II", // 35 <= BMI < 40
  "Obesity Class III", // BMI >= 40
];

// Rekomendasi Aktivitas Berdasarkan Kategori BMI (simulasi)
const exerciseRecommendations = [
  "Fokus pada peningkatan massa otot. Latihan kekuatan dan asupan protein tinggi sangat dianjurkan. Konsultasi gizi untuk penambahan berat badan sehat.",
  "Pertahankan gaya hidup aktif. Lakukan olahraga rutin seperti kardio (jogging, berenang) 3-5 kali seminggu dan latihan kekuatan 2-3 kali seminggu.",
  "Fokus pada defisit kalori dan peningkatan aktivitas fisik. Latihan kardio intensitas sedang hingga tinggi (misal: lari, sepeda) dan perhatikan porsi makan.",
  "Kombinasi latihan kardio dan kekuatan. Mulai dengan intensitas rendah hingga sedang, tingkatkan perlahan. Penting untuk konsisten dan didampingi profesional.",
  "Prioritaskan latihan low-impact seperti jalan kaki, berenang, atau bersepeda statis untuk mengurangi beban sendi. Perubahan pola makan sangat penting.",
  "Sangat disarankan untuk segera konsultasi dengan dokter dan ahli gizi untuk rencana penanganan medis dan diet yang terstruktur dan aman.",
];

// Fungsi yang dijalankan saat halaman selesai dimuat
window.onload = function () {
  loadModel(); // Memuat model (simulasi)
  checkAuthStatus(); // Memeriksa status login pengguna (dari token di localStorage)
  showPage("home"); // Memastikan halaman 'home' yang pertama kali ditampilkan
};

// ===========================================
// TensorFlow.js Model Loading
// ===========================================
async function loadModel() {
  try {
    // --- LOAD MODEL DARI FOLDER PUBLIC ---
    // Asumsi model berada di public/model/
    // URL relatif terhadap root server Express yang menyajikan folder public
    // Jadi, jika Express menyajikan public, maka 'model/model.json' akan menjadi
    // http://localhost:3000/model/model.json
    model = await tf.loadLayersModel("./model/model.json");
    console.log("Model TensorFlow.js berhasil dimuat dari server.");
  } catch (error) {
    console.error("Error loading TensorFlow.js model:", error);
    // alert('Gagal memuat model AI. Beberapa fitur mungkin tidak berfungsi optimal.'); // Nonaktifkan alert agar tidak mengganggu
  }
}

// ===========================================
// Page Navigation Functions
// ===========================================
function showPage(pageId) {
  // Sembunyikan semua halaman
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));

  // Tampilkan halaman yang dipilih
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add("active");
  } else {
    console.error(`Page with ID '${pageId}' not found.`);
    return;
  }

  // Muat data spesifik halaman (jika diperlukan dan user sudah login)
  if (pageId === "history") {
    if (currentUser) {
      loadHistory();
    } else {
      alert("Anda harus login untuk melihat riwayat.");
      showPage("login"); // Arahkan ke login jika belum login
    }
  } else if (pageId === "profile") {
    if (currentUser) {
      loadProfile();
    } else {
      alert("Anda harus login untuk melihat profil.");
      showPage("login"); // Arahkan ke login jika belum login
    }
  }
}

// ===========================================
// Authentication Functions (Interaksi dengan Backend API)
// ===========================================
async function checkAuthStatus() {
  const token = localStorage.getItem("fitcheck_token"); // Ambil token dari localStorage
  if (token) {
    // Jika ada token, coba verifikasi atau ambil data user dari backend
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        currentUser = data.user;
        updateNavbar(true);
        loadProfile();
        console.log("User sudah login:", currentUser.email);
      } else {
        logout(); // Token tidak valid atau user tidak ditemukan, paksa logout
        console.log(
          "Token tidak valid atau user tidak ditemukan, user harus login ulang."
        );
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      logout(); // Error jaringan atau server, paksa logout
    }
  } else {
    updateNavbar(false);
  }
}

async function register(event) {
  event.preventDefault(); // Mencegah form submit secara default

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const age = parseInt(document.getElementById("registerAge").value);
  const gender = document.getElementById("registerGender").value;

  // Validasi input
  if (
    !name ||
    !email ||
    !password ||
    isNaN(age) ||
    age < 1 ||
    age > 120 ||
    !gender
  ) {
    alert(
      "Mohon isi semua data pendaftaran dengan benar dan umur antara 1-120."
    );
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, age, gender }),
    });

    const data = await response.json();

    if (response.ok) {
      // Status 2xx OK
      alert(data.message);
      showPage("login"); // Arahkan ke halaman login
      // Bersihkan form register
      document.getElementById("registerName").value = "";
      document.getElementById("registerEmail").value = "";
      document.getElementById("registerPassword").value = "";
      document.getElementById("registerAge").value = "";
      document.getElementById("registerGender").value = "";
    } else {
      // Status 4xx, 5xx
      alert(data.message || "Pendaftaran gagal. Mohon coba lagi.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("Terjadi kesalahan jaringan atau server. Mohon coba lagi.");
  }
}

async function login(event) {
  event.preventDefault(); // Mencegah form submit secara default

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Status 2xx OK
      localStorage.setItem("fitcheck_token", data.token); // Simpan token JWT
      currentUser = data.user; // Simpan data user
      updateNavbar(true); // Update UI navbar
      loadProfile(); // Muat data profil
      showPage("home"); // Arahkan ke halaman utama
      alert(`Selamat datang kembali, ${currentUser.name}! Login berhasil.`);
      // Bersihkan form login
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";
    } else {
      // Status 4xx, 5xx
      alert(data.message || "Email atau password salah! Mohon coba lagi.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Terjadi kesalahan jaringan atau server. Mohon coba lagi.");
  }
}

function logout() {
  if (confirm("Anda yakin ingin keluar?")) {
    currentUser = null;
    localStorage.removeItem("fitcheck_token"); // Hapus token dari localStorage
    updateNavbar(false); // Update UI navbar
    showPage("home"); // Kembali ke halaman utama
    alert("Anda telah berhasil keluar.");
  }
}

// Update tampilan navbar berdasarkan status login
function updateNavbar(isLoggedIn) {
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");
  const profileLink = document.getElementById("profileLink");
  const historyLink = document.getElementById("historyLink");

  if (isLoggedIn) {
    loginLink.classList.add("hidden");
    logoutLink.classList.remove("hidden");
    profileLink.classList.remove("hidden");
    historyLink.classList.remove("hidden");
  } else {
    loginLink.classList.remove("hidden");
    logoutLink.classList.add("hidden");
    profileLink.classList.add("hidden");
    historyLink.classList.add("hidden");
  }
}

// ===========================================
// BMI Calculation and Prediction (dengan Backend API)
// ===========================================
async function checkBMI(event) {
  event.preventDefault(); // Mencegah form submit secara default

  const name = document.getElementById("checkName").value.trim();
  const age = parseInt(document.getElementById("checkAge").value);
  const weight = parseFloat(document.getElementById("checkWeight").value);
  const height = parseFloat(document.getElementById("checkHeight").value);
  const gender = document.getElementById("checkGender").value;

  // Validasi input
  if (
    !name ||
    isNaN(age) ||
    age < 1 ||
    age > 120 ||
    isNaN(weight) ||
    weight <= 0 ||
    isNaN(height) ||
    height <= 0 ||
    !gender
  ) {
    alert(
      "Mohon isi semua data pemeriksaan berat badan dengan angka yang valid dan umur antara 1-120."
    );
    return;
  }

  const heightInMeters = height / 100; // Konversi cm ke meter
  const bmi = weight / (heightInMeters * heightInMeters);

  // Gunakan model TensorFlow.js untuk prediksi kategori (jika sudah dimuat)
  let bmiCategoryIndex = getBMICategory(bmi); // Default ke logika sederhana
  let exerciseIndex = getExerciseRecommendation(bmi, age, gender); // Default ke logika sederhana

  // Jika model TensorFlow.js sudah dimuat, gunakan untuk prediksi
  if (model) {
    try {
      // Ini adalah contoh input untuk model. SESUAIKAN DENGAN MODEL ANDA
      // Jika model Anda dilatih dengan fitur berbeda atau normalisasi berbeda,
      // Anda harus mengubah array di bawah ini
      const genderEncoded = gender === "male" ? 1 : 0; // Mengubah 'male'/'female' menjadi 1/0
      // Contoh normalisasi data input untuk model (sesuaikan dengan pelatihan model Anda)
      const inputTensor = tf.tensor2d([
        [age / 100, weight / 150, height / 200, genderEncoded],
      ]);

      const prediction = model.predict(inputTensor);
      // Asumsi model mengeluarkan probabilitas kelas atau indeks kelas langsung
      const predictionData = await prediction.data();
      console.log("Prediction raw data:", predictionData);

      // Jika model mengembalikan probabilitas, gunakan argMax untuk mendapatkan indeks kelas dengan probabilitas tertinggi
      bmiCategoryIndex = tf.argMax(prediction, 1).dataSync()[0]; // argMax(tensor, axis)

      // Rekomendasi olahraga bisa juga didapatkan dari model jika model Anda memprediksi itu
      // Untuk saat ini, kita masih pakai logika sederhana berdasarkan BMI kategori
      exerciseIndex = getExerciseRecommendation(bmi, age, gender);

      inputTensor.dispose(); // Penting untuk membuang tensor dari memori GPU setelah digunakan
      prediction.dispose();
      console.log(
        "Prediksi menggunakan TensorFlow.js:",
        bmiCategories[bmiCategoryIndex]
      );
    } catch (tfError) {
      console.error("Error during TensorFlow.js prediction:", tfError);
      alert("Gagal melakukan prediksi AI. Menggunakan kalkulasi BMI standar.");
      // Fallback ke logika sederhana jika AI gagal
      bmiCategoryIndex = getBMICategory(bmi);
      exerciseIndex = getExerciseRecommendation(bmi, age, gender);
    }
  } else {
    console.log("Model AI belum dimuat, menggunakan kalkulasi BMI standar.");
  }

  displayResults(bmi, bmiCategoryIndex, exerciseIndex);

  // Kirim data pemeriksaan ke backend jika user login
  if (currentUser) {
    try {
      const token = localStorage.getItem("fitcheck_token");
      const response = await fetch(`${API_BASE_URL}/bmi/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Kirim token autentikasi
        },
        body: JSON.stringify({
          name,
          age,
          weight,
          height,
          gender,
          bmi: bmi.toFixed(1),
          category: bmiCategories[bmiCategoryIndex],
          exercise: exerciseRecommendations[exerciseIndex],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Status 2xx OK
        console.log("Pemeriksaan BMI berhasil disimpan:", data);
      } else {
        // Status 4xx, 5xx
        console.error("Gagal menyimpan pemeriksaan BMI:", data.message);
        alert(
          "Gagal menyimpan hasil pemeriksaan. " +
            (data.message || "Terjadi kesalahan.")
        );
      }
    } catch (error) {
      console.error("Error saving BMI check:", error);
      alert("Terjadi kesalahan jaringan saat menyimpan hasil BMI.");
    }
  } else {
    alert(
      "Anda tidak login. Hasil pemeriksaan tidak akan disimpan di riwayat."
    );
  }
}

// Fungsi untuk menentukan kategori BMI (tetap sebagai fallback atau referensi)
function getBMICategory(bmi) {
  if (bmi < 18.5) return 0; // Underweight
  else if (bmi < 25) return 1; // Normal weight
  else if (bmi < 30) return 2; // Overweight
  else if (bmi < 35) return 3; // Obesity Class I
  else if (bmi < 40) return 4; // Obesity Class II
  else return 5; // Obesity Class III
}

// Fungsi untuk menentukan rekomendasi aktivitas (tetap sebagai fallback atau referensi)
function getExerciseRecommendation(bmi, age, gender) {
  // Ini bisa dioptimalkan dengan logika yang lebih kompleks atau model terpisah
  return getBMICategory(bmi); // Menggunakan indeks yang sama dengan kategori BMI
}

function displayResults(bmi, categoryIndex, exerciseIndex) {
  document.getElementById("bmiValue").textContent = bmi.toFixed(1);
  document.getElementById("bmiCategory").textContent =
    bmiCategories[categoryIndex];
  document.getElementById("exerciseRecommendation").textContent =
    exerciseRecommendations[exerciseIndex];
  document.getElementById("results").style.display = "block";

  // Scroll ke bagian hasil agar terlihat
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

// ===========================================
// History Functions (Interaksi dengan Backend API)
// ===========================================
async function loadHistory() {
  if (!currentUser) {
    document.getElementById("historyList").innerHTML =
      '<p class="empty-state">Anda harus login untuk melihat riwayat.</p>';
    return;
  }

  const historyListElement = document.getElementById("historyList");
  historyListElement.innerHTML = '<p class="empty-state">Memuat riwayat...</p>'; // Tampilkan pesan loading

  try {
    const token = localStorage.getItem("fitcheck_token");
    const response = await fetch(`${API_BASE_URL}/bmi/history`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const userHistory = data.history;
      if (userHistory.length === 0) {
        historyListElement.innerHTML =
          '<p class="empty-state">Belum ada riwayat pemeriksaan untuk akun ini.</p>';
      } else {
        // Buat HTML untuk setiap item riwayat
        historyListElement.innerHTML = userHistory
          .map(
            (record) => `
                    <div class="history-item">
                        <div>
                            <strong>${record.name}</strong><br>
                            <small>Umur: ${record.age} | BB: ${
              record.weight
            }kg | TB: ${record.height}cm | ${
              record.gender === "male" ? "Laki-laki" : "Perempuan"
            }</small><br>
                            <small>BMI: ${record.bmi} - <strong>${
              record.category
            }</strong></small><br>
                            <small>Tanggal: ${new Date(
                              record.date
                            ).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}</small>
                        </div>
                        <div style="text-align: right; max-width: 50%;">
                            <small>Rekomendasi: ${record.exercise}</small>
                        </div>
                    </div>
                `
          )
          .join("");
      }
    } else {
      historyListElement.innerHTML = `<p class="empty-state" style="color: red;">Gagal memuat riwayat: ${
        data.message || "Kesalahan server."
      }</p>`;
      console.error("Gagal memuat riwayat:", data.message);
    }
  } catch (error) {
    console.error("Error fetching history:", error);
    historyListElement.innerHTML =
      '<p class="empty-state" style="color: red;">Terjadi kesalahan jaringan saat memuat riwayat.</p>';
  }
}

// ===========================================
// Profile Functions (Interaksi dengan Backend API)
// ===========================================
async function loadProfile() {
  if (!currentUser) {
    document.getElementById("profileName").textContent = "Tamu";
    document.getElementById("profileEmail").textContent = "Belum Login";
    document.getElementById("profileAvatar").textContent = "❓";
    document.getElementById("profileNameInput").value = "";
    document.getElementById("profileAgeInput").value = "";
    document.getElementById("profileGenderInput").value = "";
    return;
  }

  // Isi tampilan profil dengan data currentUser
  document.getElementById("profileName").textContent =
    currentUser.name || "Nama User";
  document.getElementById("profileEmail").textContent =
    currentUser.email || "email@example.com";
  document.getElementById("profileAvatar").textContent = currentUser.name
    ? currentUser.name.charAt(0).toUpperCase()
    : "👤";

  // Isi form update profil dengan data user saat ini
  document.getElementById("profileNameInput").value = currentUser.name || "";
  document.getElementById("profileAgeInput").value = currentUser.age || "";
  document.getElementById("profileGenderInput").value =
    currentUser.gender || "";
}

async function updateProfile() {
  if (!currentUser) {
    alert("Anda harus login untuk mengupdate profil.");
    return;
  }

  const newName = document.getElementById("profileNameInput").value.trim();
  const newAge = parseInt(document.getElementById("profileAgeInput").value);
  const newGender = document.getElementById("profileGenderInput").value;

  // Validasi input
  if (!newName || isNaN(newAge) || newAge < 1 || newAge > 120 || !newGender) {
    alert("Mohon isi semua data profil dengan benar dan umur antara 1-120.");
    return;
  }

  try {
    const token = localStorage.getItem("fitcheck_token");
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT", // Menggunakan method PUT untuk update
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName, age: newAge, gender: newGender }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Update objek currentUser lokal dengan data yang diperbarui dari server
      currentUser = { ...currentUser, ...data.updatedUser };
      alert("Profil berhasil diupdate!");
      loadProfile(); // Muat ulang tampilan profil untuk menampilkan perubahan
    } else {
      alert(data.message || "Gagal mengupdate profil. Mohon coba lagi.");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Terjadi kesalahan jaringan saat mengupdate profil.");
  }
}
