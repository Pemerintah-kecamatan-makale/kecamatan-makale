document.addEventListener("DOMContentLoaded", function() {
    // 1. Load Header & Footer
    loadComponent('header-placeholder', 'assets/components/header.html');
    loadComponent('footer-placeholder', 'assets/components/footer.html');
    
    // 2. Fetch Berita
    fetchBerita();
});

function loadComponent(id, url) {
    fetch(url)
        .then(res => res.text())
        .then(data => { document.getElementById(id).innerHTML = data; })
        .catch(err => console.log('Gagal load:', err));
}

// FUNGSI PENTING: Mengubah link Drive menjadi link gambar langsung
function getDirectImageUrl(url) {
    if (!url || !url.includes('drive.google.com')) return 'assets/images/default.jpg';
    const id = url.match(/[-\w]{25,}/);
    return id ? `https://lh3.googleusercontent.com/d/${id[0]}=w800` : url;
}

async function fetchBerita() {
    const SPREADSHEET_ID = `1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ`;
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;
    
    try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        const container = document.getElementById('berita-container');
        
        container.innerHTML = ''; // Kosongkan placeholder
        
        json.table.rows.forEach(row => {
            const judul = row.c[1]?.v || 'Tanpa Judul';
            const linkFoto = row.c[3]?.v || ''; // Kolom Upload Foto
            const foto = getDirectImageUrl(linkFoto);
            
            container.innerHTML += `
                <div class="bg-white p-4 rounded-lg shadow">
                    <img src="${foto}" class="w-full h-40 object-cover mb-4" onerror="this.src='assets/images/default.jpg'">
                    <h3 class="font-bold">${judul}</h3>
                </div>
            `;
        });
    } catch (err) {
        console.error(err);
    }
}
