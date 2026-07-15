/**
 * Script Pengolahan, Validasi Form SKM, & Render Grafik Chart.js
 * Kantor Kecamatan Makale, Kabupaten Tana Toraja
 */

const URL_API = "https://script.google.com/macros/s/AKfycbyvaAvWB2_ACWwN3Bk7fOezihnbLMZ_PmJ6Earj2y122Jsyt6RqbCKTPzKc30BW8J0rSw/exec?dashboard=1";
let chartSKM = null;

// ==========================================
// 1. FUNGSI AMBIL DATA & TAMPILKAN GRAFIK (ANTI-TEXT CRASH)
// ==========================================
function muatDataDanGrafik() {
    fetch(URL_API)
        .then(res => {
            if (!res.ok) throw new Error("Koneksi API bermasalah.");
            // Ambil respons dalam bentuk teks terlebih dahulu untuk menghindari crash pembacaan JSON
            return res.text(); 
        })
        .then(textRaw => {
            console.log("Respons mentah dari server:", textRaw);
            
            let data;
            try {
                // Coba ubah teks menjadi JSON objek
                data = JSON.parse(textRaw);
            } catch (e) {
                // JIKA TERNYATA YANG KELUAR ADALAH TEKS BERAWALAN "SKM Kecamatan..."
                console.warn("Server mengirimkan format teks berbalut string JSON. Melakukan ekstraksi kedua...");
                
                // Coba bersihkan kutip ganda berlebih jika string terbungkus text
                try {
                    data = JSON.parse(JSON.parse(textRaw));
                } catch (err2) {
                    // Jika benar-benar teks HTML/Plain biasa, kita coba bersihkan manual jika itu string data objek
                    let jsonCleaned = textRaw.substring(textRaw.indexOf("{"), textRaw.lastIndexOf("}") + 1);
                    if (jsonCleaned) {
                        data = JSON.parse(jsonCleaned);
                    } else {
                        throw new Error("Format yang dikirim server benar-benar teks murni, bukan JSON data: " + textRaw);
                    }
                }
            }

            console.log("Data berhasil diparsing secara aman:", data);

            // Tampilkan Data Angka ke Dashboard
            if (document.getElementById("responden")) {
                document.getElementById("responden").innerText = data.responden ?? data.Responden ?? "0";
            }
            if (document.getElementById("ikm")) {
                document.getElementById("ikm").innerText = data.ikm ?? data.Ikm ?? data.IKM ?? "0.00";
            }
            if (document.getElementById("mutu")) {
                document.getElementById("mutu").innerText = data.mutu ?? data.Mutu ?? "-";
            }
            if (document.getElementById("kategori")) {
                document.getElementById("kategori").innerText = data.kategori ?? data.Kategori ?? "-";
            }

            // Baca Rekapitulasi Unsur (U1 - U9)
            let rekap = data.rekap || data.Rekap || data;

            if (rekap) {
                const bersihkanNilai = (key) => {
                    let nilaiRaw = rekap[key.toLowerCase()] ?? rekap[key.toUpperCase()] ?? "0";
                    if (typeof nilaiRaw === 'string') {
                        nilaiRaw = nilaiRaw.replace(',', '.');
                    }
                    const hasil = parseFloat(nilaiRaw);
                    return isNaN(hasil) ? 0 : hasil;
                };

                const datasetUnsur = [
                    bersihkanNilai('u1'), bersihkanNilai('u2'), bersihkanNilai('u3'),
                    bersihkanNilai('u4'), bersihkanNilai('u5'), bersihkanNilai('u6'),
                    bersihkanNilai('u7'), bersihkanNilai('u8'), bersihkanNilai('u9')
                ];

                const ctx = document.getElementById('ikmChart');
                if (!ctx) return;

                if (chartSKM) {
                    chartSKM.destroy();
                }

                chartSKM = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9'],
                        datasets: [{
                            label: 'Nilai Unsur',
                            data: datasetUnsur,
                            backgroundColor: 'rgba(153, 27, 27, 0.9)',
                            borderColor: 'rgba(153, 27, 27, 1)',
                            borderWidth: 1,
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { min: 0, max: 4, ticks: { stepSize: 1 } }
                        }
                    }
                });
            }
        })
        .catch(err => {
            console.error("Gagal memproses visualisasi grafik:", err);
        });
}

// ==========================================
// 2. TRIGGER SAAT HALAMAN SELESAI DIMUAT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Muat data dashboard pertama kali secara otomatis
    muatDataDanGrafik();

    // Jalankan validasi pengiriman form jika elemen formSKM ditemukan
    const formSKM = document.getElementById("formSKM");
    if (formSKM) {
        formSKM.addEventListener("submit", function(event) {
            event.preventDefault();

            const notifContainer = document.getElementById("notif");
            const notifIcon = document.getElementById("notifIcon");
            const notifTitle = document.getElementById("notifTitle");
            const notifText = document.getElementById("notifText");
            const btnKirim = document.getElementById("btnKirim");

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

            const adaYangKosong = Object.values(dataWajib).some(value => value === "");

            if (adaYangKosong) {
                if (notifContainer && notifIcon && notifTitle && notifText) {
                    notifContainer.className = "mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 shadow block animate-pulse";
                    notifIcon.className = "fas fa-circle-exclamation text-2xl mr-3 text-red-600";
                    notifTitle.innerText = "Isian Belum Lengkap!";
                    notifText.innerText = "Mohon melengkapi profil responden serta seluruh 9 unsur penilaian sebelum mengirim.";
                    
                    window.scrollTo({
                        top: notifContainer.getBoundingClientRect().top + window.scrollY - 40,
                        behavior: 'smooth'
                    });
                }
                return false;
            }

            if (btnKirim) {
                btnKirim.disabled = true;
                btnKirim.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Mengirim...`;
            }

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

            fetch(URL_API, {
                method: "POST",
                body: JSON.stringify(payload)
            })
            .then(res => {
                if (!res.ok) throw new Error("Gangguan transmisi database.");
                return res.json();
            })
            .then(response => {
                if (response.status === "success") {
                    if (notifContainer && notifIcon && notifTitle && notifText) {
                        notifContainer.className = "mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800 shadow block";
                        notifIcon.className = "fas fa-circle-check text-2xl mr-3 text-green-600";
                        notifTitle.innerText = "Berhasil Dikirim!";
                        notifText.innerText = "Terima kasih, data survei Anda telah masuk ke database Kecamatan Makale.";
                    }
                    
                    formSKM.reset();
                    muatDataDanGrafik(); // Update grafik & angka seketika setelah submit berhasil!
                } else {
                    throw new Error(response.message || "Gagal memproses data.");
                }
            })
            .catch(error => {
                console.error("Gagal mengirim data:", error);
                if (notifContainer && notifIcon && notifTitle && notifText) {
                    notifContainer.className = "mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800 shadow block";
                    notifIcon.className = "fas fa-triangle-exclamation text-2xl mr-3 text-yellow-600";
                    notifTitle.innerText = "Gagal Mengirim";
                    notifText.innerText = `Terjadi kesalahan: ${error.message}.`;
                }
            })
            .finally(() => {
                if (btnKirim) {
                    btnKirim.disabled = false;
                    btnKirim.innerHTML = `<i class="fas fa-paper-plane mr-2"></i> Kirim Survei`;
                }
                if (notifContainer) {
                    window.scrollTo({
                        top: notifContainer.getBoundingClientRect().top + window.scrollY - 40,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});
