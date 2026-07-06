// main.js - Penggerak Komponen Reusable Website Kecamatan Makale
document.addEventListener("DOMContentLoaded", function() {
    
    // DETEKSI OTOMATIS JALUR REPOSITORI GITHUB PAGES (Pembersihan Jalur Slash)
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/kecamatan-makale/' : '/';
    
    // 1. Memuat Elemen Gabungan Header & Navbar
    const headerContainer = document.getElementById('header-placeholder');
    if (headerContainer) {
        // PERBAIKAN: Menyusun url mutlak yang dinamis dan bersih untuk fetch komponen
        const fetchUrl = `${window.location.origin}${basePath}assets/components/header.html`;
        
        fetch(fetchUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                headerContainer.innerHTML = data;
                highlightActiveMenu();
            })
            .catch(err => console.error('Gagal memuat Header:', err));
    }

    // 2. Memuat Elemen Footer
    const footerContainer = document.getElementById('footer-placeholder');
    if (footerContainer) {
        const fetchUrl = `${window.location.origin}${basePath}assets/components/footer.html`;
        
        fetch(fetchUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(err => console.error('Gagal memuat Footer:', err));
    }

    // Fungsi otomatis menandai menu halaman aktif saat ini
    function highlightActiveMenu() {
        let currentPath = window.location.pathname.split("/").pop();
        
        // Atur default ke index.html jika pengguna berada di beranda root folder
        if (currentPath === '') {
            currentPath = 'index.html';
        }
        
        const menuLinks = document.querySelectorAll('#header-placeholder nav a');
        
        menuLinks.forEach(link => {
            const hrefAttr = link.getAttribute('href');
            if (currentPath === hrefAttr) {
                // Modifikasi penanda aktif warna amber khas ornamen Toraja
                link.classList.add('text-amber-400', 'font-bold', 'border-b-2', 'border-amber-400', 'pb-1');
            }
        });
    }
});
// Tambahan untuk mengambil data berita
const SPREADSHEET_ID = '1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ'; 
const jsonUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&tq=select%20*`;

async function fetchLiveNewsData() {
    const gridContainer = document.getElementById('news-grid');
    if (!gridContainer) return; // Keluar jika elemen tidak ada di halaman ini

    try {
        const response = await fetch(jsonUrl);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows;

        gridContainer.innerHTML = ''; 
        // Mengambil 3 data terbaru saja untuk halaman index
        const latestRows = [...rows].slice(1).reverse().slice(0, 3);

        latestRows.forEach((row) => {
            const judul = row.c[1]?.v || "Tanpa Judul";
            const tgl = row.c[5]?.f || row.c[5]?.v || "";
            const isi = row.c[2]?.v || "";

            const card = document.createElement('div');
            card.className = "p-4 bg-white rounded-lg shadow-sm border";
            card.innerHTML = `
                <h3 class="font-bold text-md">${judul}</h3>
                <p class="text-[10px] text-gray-400 mb-2">${tgl}</p>
                <p class="text-sm line-clamp-2">${isi}</p>
            `;
            gridContainer.appendChild(card);
        });
    } catch (err) {
        console.error("Gagal memuat berita:", err);
    }
}

// Panggil fungsi ini saat DOM siap
document.addEventListener("DOMContentLoaded", fetchLiveNewsData);
