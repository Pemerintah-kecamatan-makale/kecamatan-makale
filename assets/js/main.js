// main.js - Penggerak Komponen Reusable Website Kecamatan Makale
document.addEventListener("DOMContentLoaded", function() {
    
    // DETEKSI OTOMATIS JALUR REPOSITORI GITHUB PAGES (Pembersihan Jalur Slash)
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/kecamatan-makale/' : '/';
    
    // 1. Memuat Elemen Gabungan Header & Navbar
    const headerContainer = document.getElementById('header-placeholder');
    if (headerContainer) {
        // Menyusun url mutlak yang dinamis dan bersih untuk fetch komponen
        const fetchUrl = `${window.location.origin}${basePath}assets/components/header.html`;
        
        fetch(fetchUrl)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                headerContainer.innerHTML = data;
                highlightActiveMenu();
                inisialisasiMenuMobile(); // <-- TAMBAHAN: Mengaktifkan fungsi menu HP setelah header terpasang
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

    // <-- TAMBAHAN: Fungsi Pengendali Hamburger Menu Responsif di HP -->
    function inisialisasiMenuMobile() {
        const tombolMenu = document.getElementById("mobile-menu-button"); // ID tombol garis tiga di header.html
        const navMenu = document.getElementById("mobile-menu");           // ID container list menu HP di header.html

        if (tombolMenu && navMenu) {
            tombolMenu.addEventListener("click", function(e) {
                e.stopPropagation(); // Mencegah event bubbling
                navMenu.classList.toggle("hidden");
            });

            // Opsional: Menutup menu secara otomatis jika pengguna mengklik di luar area menu
            document.addEventListener("click", function(e) {
                if (!navMenu.classList.contains("hidden") && !navMenu.contains(e.target) && e.target !== tombolMenu) {
                    navMenu.classList.add("hidden");
                }
            });
        }
    }
});
