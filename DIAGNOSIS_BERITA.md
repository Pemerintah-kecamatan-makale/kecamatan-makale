# DIAGNOSIS: Berita & Kegiatan Terbaru Tidak Muncul di Beranda

## Masalah
Section "Berita & Kegiatan Terbaru" di halaman beranda menampilkan loading text "Memuat berita terbaru..." tetapi tidak pernah menampilkan data berita sebenarnya.

## Kemungkinan Penyebab & Solusi

### 1. ✓ SUDAH DIPERBAIKI - Error Handling & Logging
**Masalah:** Sebelumnya tidak ada error message yang jelas jika fetch gagal.

**Solusi:** 
- Ditambahkan better error handling dengan pesan yang lebih deskriptif
- Ditambahkan timeout 10 detik untuk prevent hanging
- Ditambahkan console logging untuk debugging

**Cara Test:** Buka browser console (F12) saat loading halaman beranda, lihat log messages.

---

### 2. Google Sheets Tidak Ada Data
**Masalah:** Google Sheets kosong atau tidak memiliki berita yang valid.

**Solusi:**
a) Buka Google Sheets dengan ID: `1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ`
b) Verifikasi struktur kolom:
   - Column A (Index 0): Timestamp
   - Column B (Index 1): **Judul Berita** ← Wajib ada & tidak boleh kosong
   - Column C (Index 2): **Isi/Konten Berita** ← Wajib ada & tidak boleh kosong
   - Column D (Index 3): URL Foto (dari Google Drive)
   - Column E (Index 4): Kategori
   - Column F (Index 5): Tanggal Publish (format: dd/mm/yyyy)

c) Pastikan ada minimal 1 baris data (header + 1 data row)

d) Verifikasi Header Row: "Timestamp | Judul | Isi | Foto | Kategori | Tanggal"

---

### 3. Google Sheets Tidak Dapat Diakses
**Masalah:** Spreadsheet sharing setting tidak benar atau URL tidak valid.

**Solusi:**
a) Di Google Sheets, klik "Share"
b) Ubah sharing ke "Anyone with the link can view"
c) Pastikan link terbuka untuk publik

**Cara Test:** Buka di browser: 
https://docs.google.com/spreadsheets/d/1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ/edit#gid=0

Jika tidak bisa buka, itu masalah sharing setting.

---

### 4. CORS/Security Issues
**Masalah:** Browser memblokir akses cross-origin ke Google Sheets.

**Solusi:**
- Google Sheets API support CORS, jadi seharusnya tidak masalah
- Jika masih ada issue, lihat console error message secara detail

**Cara Test:** 
1. Buka test-berita.html di browser (ada di root folder)
2. Lihat log output untuk detail fetch attempt
3. Bandingkan hasil dengan error message di beranda

---

## Debugging Steps

### Step 1: Cek Error Message di Browser
1. Buka halaman beranda
2. Tekan F12 untuk buka Developer Tools
3. Buka tab "Console"
4. Lihat log messages - seharusnya ada:
   - `✓ berita-container element ditemukan`
   - `✓ DOMContentLoaded fired`
   - `✓ Fetch function starting...`
   - Atau ada error message

### Step 2: Test dengan test-berita.html
1. Buka file `test-berita.html` di browser
2. Lihat detailed output untuk:
   - Apakah fetch berhasil?
   - Berapa banyak rows di Google Sheets?
   - Struktur data seperti apa?
   - Berapa banyak berita yang valid?

### Step 3: Manual Test di Browser Console
```javascript
// Paste this in browser console (F12 → Console tab):
const SPREADSHEET_ID = '1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ';
const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;
fetch(url)
  .then(r => r.text())
  .then(t => {
    const json = JSON.parse(t.substring(t.indexOf('{'), t.lastIndexOf('}')+1));
    console.log('Data:', json);
    console.log('Rows:', json.table.rows.length);
  })
  .catch(e => console.error('Error:', e));
```

---

## Expected Behavior

Setelah perbaikan, beranda seharusnya menampilkan salah satu:

### Success Case:
- Tampil 1 berita terbaru di sebelah kiri
- Tampil form pengaduan di sebelah kanan
- Berita menampilkan: Foto, Judul, Tanggal, Preview Isi

### Empty Data Case:
- Tampil pesan: "Belum ada berita yang tersedia di Google Sheets"
- User diminta untuk menambah data di spreadsheet

### Error Case:
- Tampil error message yang deskriptif:
  - "Error koneksi ke Google Sheets"
  - "Koneksi timeout"
  - "Format data tidak valid"
  - "Struktur data Google Sheets tidak sesuai"

---

## File yang Dimodifikasi

1. **index.html** - Fungsi `fetchBeritaBeranda()` di dalam `<script>` tag
   - Ditambahkan error handling
   - Ditambahkan timeout (10 detik)
   - Ditambahkan console logging
   - Ditambahkan data validation

2. **test-berita.html** - File baru untuk diagnosis
   - Tidak perlu di-commit, hanya untuk debugging

---

## Next Steps Jika Masalah Masih Ada

1. Jalankan step-by-step debugging di atas
2. Catat error message dari browser console
3. Cek output dari test-berita.html
4. Verifikasi Google Sheets data & sharing settings
5. Report error message lengkap untuk debugging lebih lanjut

---

## Technical Details

### URL Google Sheets API
```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/gviz/tq?tqx=out:json
```

### Expected JSON Response Structure
```javascript
{
  "version": "0.6",
  "reqId": "0",
  "status": "ok",
  "table": {
    "cols": [...],
    "rows": [
      {
        "c": [
          { "v": "timestamp" },
          { "v": "judul_berita" },
          { "v": "isi_berita" },
          { "v": "url_foto" },
          { "v": "kategori" },
          { "v": "tanggal", "f": "formatted_date" }
        ]
      },
      // ... more rows
    ]
  }
}
```

### Column Index Mapping
- Index 0: Timestamp
- Index 1: Judul (REQUIRED)
- Index 2: Isi (REQUIRED)
- Index 3: Foto
- Index 4: Kategori
- Index 5: Tanggal

---

Created: 2026-07-10
Modified: By Copilot CLI for debugging purposes
