# Prediksi BMI dan Rekomendasi Rutinitas Olahraga

Proyek ini membangun model deep learning multi-output menggunakan TensorFlow dan Keras untuk memprediksi tiga output sekaligus berdasarkan data dasar pengguna:
1. **Nilai BMI (Body Mass Index)** - Prediksi regresi.
2. **Kategori BMI** - Prediksi klasifikasi (Normal Weight, Obese Class 1, Obese Class 2, Obese Class 3, Overweight, Underweight).
3. **Rutinitas Olahraga yang Disarankan** - Prediksi klasifikasi berdasarkan karakteristik tubuh.

## 1. Tujuan Proyek

Tujuan utama dari proyek ini adalah membuat sistem cerdas yang mampu memprediksi status kesehatan pengguna berdasarkan usia, tinggi badan, berat badan, dan gender. Model akan memberikan:
- Nilai BMI aktual,
- Kategori klasifikasi BMI, serta
- Rekomendasi jenis olahraga yang cocok.

## 2. Dataset

Dataset yang digunakan berasal dari [Kaggle - BMI Dataset](https://www.kaggle.com/datasets/arjunk3/bmi-dataset) yang berisi informasi seperti:
- Umur
- Tinggi badan (dalam meter)
- Berat badan (dalam kg)
- Gender
- Nilai BMI
- Kategori BMI
- Rutinitas Olahraga

## 3. Alur Proyek

### a. Persiapan Data
- Mengimpor dataset dan menanganinya di Google Colab.
- Membersihkan data, seperti menghapus missing values dan duplikasi.
- Memastikan nilai BMI dihitung ulang menggunakan rumus standar.
- Encoding kolom kategorikal dengan `LabelEncoder`.
- Normalisasi data numerik menggunakan `StandardScaler`.

### b. Pembangunan Model Multi-Output
- Model neural network menggunakan Keras Functional API
- Model memiliki 1 input dan 3 output, yaitu:
  - Output 1: Prediksi nilai BMI 
  - Output 2: Prediksi kategori BMI 
  - Output 3: Prediksi rekomendasi olahraga 
- Fungsi loss disesuaikan untuk masing-masing output (`mse`, `sparse_categorical_crossentropy`).
- Penggunaan `EarlyStopping` untuk menghindari overfitting.

### c. Pelatihan dan Evaluasi Model
- Model dilatih selama 50 epoch dengan batch size 32 dan validasi 20%.
- Visualisasi performa model berdasarkan loss dan akurasi.
- Evaluasi dilakukan pada data uji untuk mengukur performa akhir.

### d. Inferensi
- Disediakan fungsi interaktif `prediksi_tf_multioutput` untuk prediksi langsung berdasarkan input manual dari pengguna (nama, umur, gender, berat, tinggi).
- Menampilkan hasil BMI, kategori, dan rekomendasi olahraga.

### e. Penyimpanan Model
- Model disimpan dalam format `.h5` (Keras).
- Juga dikonversi ke format TensorFlow.js untuk digunakan di aplikasi web.
- File scaler dan encoder disimpan menggunakan `joblib`.

## 4. Teknologi dan Library yang Digunakan

- Python
- TensorFlow dan Keras
- Pandas, NumPy, Seaborn, Matplotlib
- Scikit-learn
- TensorFlow.js
- Google Colab
- Kaggle API

## 5. Cara Menjalankan Proyek

1. Buka Google Colab dan unggah file `kaggle.json` untuk mengakses dataset.
2. Jalankan seluruh sel dari atas hingga bawah untuk:
    - Download dan ekstrak data.
    - Membersihkan dan menyiapkan data.
    - Melatih model.
    - Melakukan evaluasi.
    - Menyimpan model dan melakukan prediksi.

## 6. Hasil Akhir

- Model dapat memprediksi BMI dengan akurasi cukup baik.
- Kategori BMI dan rekomendasi olahraga memberikan hasil klasifikasi dengan tingkat akurasi yang cukup tinggi.
- Model siap diintegrasikan ke dalam aplikasi berbasis web menggunakan TensorFlow.js.
