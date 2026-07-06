document.addEventListener("DOMContentLoaded", function() {
    // 1. Selalu load Header & Footer di semua halaman
    loadComponent('header-placeholder', 'assets/components/header.html');
    loadComponent('footer-placeholder', 'assets/components/footer.html');

    // 2. Jika di halaman berita.html, fetch semua data
    if (window.location.pathname.includes('berita.html')) {
        fetchLiveNewsData();
    }
});

// Fungsi fetch yang sudah diperbaiki
async function fetchLiveNewsData() {
    const gridContainer = document.getElementById('news-grid');
    if (!gridContainer) return;

    const SPREADSHEET_ID = '1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ';
    const jsonUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

    try {
        const response = await fetch(jsonUrl);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.slice(1).reverse(); // Balik urutan

        gridContainer.innerHTML = ''; 

        rows.forEach(row => {
            const judul = row.c[1]?.v || "Tanpa Judul";
            const isi = row.c[2]?.v || "";
            const tgl = row.c[5]?.f || "Baru saja";
            // Pastikan link foto diambil dari kolom yang benar
            const foto = row.c[3]?.v || 'assets/images/default.jpg'; 

            const card = document.createElement('article');
            card.className = "bg-white p-6 rounded-2xl shadow-sm border border-gray-100";
            card.innerHTML = `
                <img src="${foto}" class="w-full h-40 object-cover rounded-lg mb-4" onerror="this.src='assets/images/default.jpg'">
                <h3 class="font-bold text-lg mb-2">${judul}</h3>
                <p class="text-xs text-gray-400 mb-4">${tgl}</p>
                <p class="text-gray-700 text-sm line-clamp-3">${isi}</p>
            `;
            gridContainer.appendChild(card);
        });
    } catch (err) {
        gridContainer.innerHTML = `<p class="text-red-500">Gagal memuat berita.</p>`;
    }
}
