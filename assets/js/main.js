document.addEventListener("DOMContentLoaded", function() {
    // Memuat Header & Footer secara otomatis di semua halaman
    loadComponent('header-placeholder', 'assets/components/header.html');
    loadComponent('footer-placeholder', 'assets/components/footer.html');
    
    // Jika berada di halaman berita.html, jalankan fungsi berita
    if (window.location.pathname.includes('berita.html')) {
        fetchLiveNewsData();
    }
});

function loadComponent(id, url) {
    fetch(url)
        .then(res => res.text())
        .then(data => { document.getElementById(id).innerHTML = data; })
        .catch(err => console.log('Gagal memuat komponen:', err));
}

async function fetchLiveNewsData() {
    const gridContainer = document.getElementById('news-grid');
    const SPREADSHEET_ID = '1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ';
    const jsonUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;
    
    try {
        const response = await fetch(jsonUrl);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.slice(1).reverse();

        gridContainer.innerHTML = ''; 

        rows.forEach(row => {
            const judul = row.c[1]?.v || "Tanpa Judul";
            const isi = row.c[2]?.v || "Tidak ada isi.";
            const tgl = row.c[5]?.f || "Baru saja";
            
            gridContainer.innerHTML += `
                <article class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 class="font-bold text-lg mb-2">${judul}</h3>
                    <p class="text-sm text-gray-500 mb-4">${tgl}</p>
                    <p class="text-gray-700 text-sm line-clamp-3">${isi}</p>
                </article>
            `;
        });
    } catch (err) {
        gridContainer.innerHTML = `<p class="text-red-500">Gagal memuat berita.</p>`;
    }
}
