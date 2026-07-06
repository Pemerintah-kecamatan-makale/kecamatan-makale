document.addEventListener("DOMContentLoaded", function() {
    // Memuat Header & Footer
    loadComponent('header-placeholder', 'assets/components/header.html');
    loadComponent('footer-placeholder', 'assets/components/footer.html');
    
    // Cek apakah halaman memiliki container berita sebelum fetch
    if (document.getElementById('berita-container')) {
        fetchBerita();
    }
});

function loadComponent(id, url) {
    const el = document.getElementById(id);
    if (!el) return; // Keluar jika elemen tidak ada
    fetch(url)
        .then(res => res.text())
        .then(data => { el.innerHTML = data; })
        .catch(err => console.log('Gagal load:', id, err));
}

async function fetchBerita() {
    const container = document.getElementById('berita-container');
    if (!container) return; // Keluar jika container tidak ditemukan

    const SPREADSHEET_ID = '1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ';
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

    try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        
        container.innerHTML = ''; 
        
        json.table.rows.slice(1).reverse().forEach(row => {
            const judul = row.c[1]?.v || "Tanpa Judul";
            const isi = row.c[2]?.v || "Tidak ada isi.";
            const tgl = row.c[5]?.f || "Baru saja";
            const rawFoto = row.c[3]?.v || ''; 
            
            // Konversi link Drive ke format gambar
            const idMatch = rawFoto.match(/[-\w]{25,}/);
            const foto = idMatch ? `https://lh3.googleusercontent.com/d/${idMatch[0]}=w800` : 'https://via.placeholder.com/400x300';

            container.innerHTML += `
                <article class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <img src="${foto}" class="w-full h-48 object-cover rounded-xl mb-4" onerror="this.src='assets/images/default.jpg'">
                    <div class="flex-grow">
                        <h3 class="font-bold text-lg mb-2 leading-tight">${judul}</h3>
                        <p class="text-xs text-gray-400 mb-3">${tgl}</p>
                        <p class="text-gray-700 text-sm leading-relaxed">${isi}</p>
                    </div>
                </article>
            `;
        });
    } catch (err) {
        console.error("Error fetching berita:", err);
        container.innerHTML = `<p class="text-red-500 text-center">Gagal memuat berita.</p>`;
    }
}
