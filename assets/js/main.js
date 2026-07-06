document.addEventListener("DOMContentLoaded", function() {
    // 1. Load Header & Footer di semua halaman
    loadComponent('header-placeholder', 'assets/components/header.html');
    loadComponent('footer-placeholder', 'assets/components/footer.html');
    
    // 2. Fetch Berita hanya jika elemen container ada di halaman tersebut
    // Mendukung ID "berita-container" (untuk beranda) atau "news-grid" (untuk halaman berita)
    if (document.getElementById('berita-container') || document.getElementById('news-grid')) {
        fetchLiveNewsData();
    }
});

function loadComponent(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    fetch(url)
        .then(res => res.text())
        .then(data => { el.innerHTML = data; })
        .catch(err => console.log('Gagal memuat komponen:', id, err));
}

async function fetchLiveNewsData() {
    const container = document.getElementById('berita-container') || document.getElementById('news-grid');
    const SPREADSHEET_ID = '1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ';
    const jsonUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;
    
    try {
        const response = await fetch(jsonUrl);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows.slice(1).reverse();

        container.innerHTML = ''; 

        rows.forEach(row => {
            const judul = row.c[1]?.v || "Tanpa Judul";
            const isi = row.c[2]?.v || "Tidak ada isi.";
            const tgl = row.c[5]?.f || "Baru saja";
            const rawFoto = row.c[3]?.v || ''; 
            
            // Konversi ID Drive ke Link Gambar Langsung
            const idMatch = rawFoto.match(/[-\w]{25,}/);
            const foto = idMatch ? `https://lh3.googleusercontent.com/d/${idMatch[0]}=w800` : 'assets/images/default.jpg';

            container.innerHTML += `
                <article class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                    <img src="${foto}" class="w-full h-48 object-cover rounded-xl mb-4" onerror="this.src='assets/images/default.jpg'">
                    <h3 class="font-bold text-lg mb-2">${judul}</h3>
                    <p class="text-xs text-gray-400 mb-4">${tgl}</p>
                    <p class="text-gray-700 text-sm line-clamp-3">${isi}</p>
                </article>
            `;
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="text-red-500 text-center">Gagal memuat berita terbaru.</p>`;
    }
}
