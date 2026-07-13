/**
 * Script Pengolahan & Validasi Form SKM Kecamatan Makale
 * Mengirim data langsung ke Google Apps Script Web App (Spreadsheet Database)
 */

document.getElementById("formSKM").addEventListener("submit", function(event) {
    // 1. Kunci proses submisi otomatis bawaan browser
    event.preventDefault();

    // 2. Inisialisasi Elemen UI Pendukung
    const notifContainer = document.getElementById("notif");
    const notifIcon = document.getElementById("notifIcon");
    const notifTitle = document.getElementById("notifTitle");
    const notifText = document.getElementById("notifText");
    const btnKirim = document.getElementById("btnKirim");

    // 3. Tangkap Seluruh Nilai Input Wajib (Di-trim agar spasi kosong dianggap kosong)
    const dataWajib = {
        umur: document.getElementById("umur").value.trim(),
        jk: document.getElementById("jk").value,
        layanan: document.getElementById("layanan").value,
        u1: document.getElementById("u1").value,
        u2: document.getElementById("u2").value,
        u3: document.getElementById("u3").value,
        u4: document.getElementById("u4").value,
        u5: document.getElementById("u5").value,
        u6: document.getElementById("u6").value,
        u7: document.getElementById("u7").value,
        u8: document.getElementById("u8").value,
        u9: document.getElementById("u9").value
    };

    // 4. Proses Pengecekan Validasi: Apakah ada salah satu field yang masih kosong ("")?
    const adaYangKosong = Object.values(dataWajib).some(value => value === "");

    if (adaYangKosong) {
        // Tampilkan Pesan Peringatan Berwarna Merah (Gagal)
        notifContainer.className = "mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 shadow block animate-pulse";
        notifIcon.className = "fas fa-circle-exclamation text-2xl mr-3 text-red-600";
        notifTitle.innerText = "Isian Belum Lengkap!";
        notifText.innerText = "Mohon melengkapi data Umur, Jenis Kelamin, Jenis Pelayanan, serta 9 Unsur Penilaian sebelum menekan tombol kirim.";
        
        // Geser layar secara lembut ke arah posisi box notifikasi di atas
        window.scrollTo({
            top: notifContainer.getBoundingClientRect().top + window.scrollY - 40,
            behavior: 'smooth'
        });
        
        return false; // Hentikan fungsi script di sini
    }

    // 5. APABILA VALIDASI SELESAI & LENGKAP: Jalankan Transmisi Data via Fetch API
    // Ubah status tombol kirim menjadi mode loading (mencegah klik ganda)
    btnKirim.disabled = true;
    btnKirim.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Memproses Pengiriman...`;

    // URL Web App hasil deploy Google Apps Script Anda
    const URL_API = "https://script.google.com/macros/s/AKfycbyvaAvWB2_ACWwN3Bk7fOezihnbLMZ_PmJ6Earj2y122Jsyt6RqbCKTPzKc30BW8J0rSw/exec";

    // Susun Payload JSON (Set nilai default untuk Nama & Saran jika kosong)
    const payload = {
        nama: document.getElementById("nama").value.trim() || "Anonim",
        umur: dataWajib.umur,
        jk: dataWajib.jk,
        layanan: dataWajib.layanan,
        u1: dataWajib.u1,
        u2: dataWajib.u2,
        u3: dataWajib.u3,
        u4: dataWajib.u4,
        u5: dataWajib.u5,
        u6: dataWajib.u6,
        u7: dataWajib.u7,
        u8: dataWajib.u8,
        u9: dataWajib.u9,
        saran: document.getElementById("saran").value.trim() || "-"
    };

    // Kirim Data dengan metode HTTP POST
    fetch(URL_API, {
        method: "POST",
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Koneksi internet bermasalah atau Server lambat.");
        }
        return res.json();
    })
    .then(response => {
        if (response.status === "success") {
            // Tampilkan Pesan Berhasil Berwarna Hijau
            notifContainer.className = "mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800 shadow block";
            notifIcon.className = "fas fa-circle-check text-2xl mr-3 text-green-600";
            notifTitle.innerText = "Terima Kasih Banyak!";
            notifText.innerText = "Survei Kepuasan Masyarakat Anda berhasil disimpan ke database Pemerintah Kecamatan Makale.";
            
            // Bersihkan isi seluruh formulir agar siap diisi responden baru
            document.getElementById("formSKM").reset();
        } else {
            throw new Error(response.message || "Gagal menyimpan data.");
        }
    })
    .catch(error => {
        console.error("Transmisi SKM Gagal:", error);
        
        // Tampilkan Pesan Error Berwarna Oranye/Kuning
        notifContainer.className = "mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 shadow block";
        notifIcon.className = "fas fa-triangle-exclamation text-2xl mr-3 text-yellow-600";
        notifTitle.innerText = "Pengiriman Terkendala";
        notifText.innerText = `Terjadi gangguan sistem: ${error.message}. Silakan periksa koneksi Anda dan coba kembali.`;
    })
    .finally(() => {
        // Kembalikan tombol kirim ke keadaan semula
        btnKirim.disabled = false;
        btnKirim.innerHTML = `<i class="fas fa-paper-plane mr-2"></i> Kirim Survei`;
        
        // Pastikan halaman bergulir ke atas untuk melihat output hasil akhir
        window.scrollTo({
            top: notifContainer.getBoundingClientRect().top + window.scrollY - 40,
            behavior: 'smooth'
        });
    });
});
