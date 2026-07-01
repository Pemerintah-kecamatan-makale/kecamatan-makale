// main.js - Penggerak Komponen Reusable Website Kecamatan Makale
document.addEventListener("DOMContentLoaded", function() {
    
    // DETEKSI OTOMATIS JALUR REPOSITORI GITHUB PAGES
    // Jika dibuka di GitHub Pages, base path akan mendeteksi '/kecamatan-makale/'
    // Jika dibuka di komputer lokal (Live Server), base path otomatis menjadi kosong/relatif
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/kecamatan-makale/' : '';
    
    // 1. Memuat Elemen Gabungan Header & Navbar
    const headerContainer = document.getElementById('header-placeholder');
    if (headerContainer) {
        fetch(`${basePath}assets/components/header.html`)
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
        fetch(`${basePath}assets/components/footer.html`)
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
        const currentPath = window.location.pathname.split("/").pop();
        const menuLinks = document.querySelectorAll('#header-placeholder nav a');
        
        menuLinks.forEach(link => {
            const hrefAttr = link.getAttribute('href');
            if (currentPath === hrefAttr || (currentPath === '' && hrefAttr === 'index.html')) {
                link.classList.add('text-amber-400', 'font-bold', 'border-b-2', 'border-amber-400', 'pb-1');
            }
        });
    }
});
