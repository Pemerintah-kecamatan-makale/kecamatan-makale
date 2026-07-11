/* ============================================================
   berita.js
   Website Resmi Kecamatan Makale
   Versi 2.0
============================================================ */

/* ============================================================
   KONFIGURASI
============================================================ */

const CONFIG = {

    spreadsheetId: "1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ",

    sheetUrl(id) {
        return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:json`;
    },

    githubRepo: "kecamatan-makale",

    pageSize: 9

};


/* ============================================================
   PATH OTOMATIS
============================================================ */

const isGithub =
window.location.hostname.includes("github.io");

const BASE_PATH =
isGithub
? `/${CONFIG.githubRepo}/`
: "/";

const DEFAULT_IMAGE =
BASE_PATH +
"assets/images/Plaza Kolam Makale.jpg";


/* ============================================================
   ELEMENT
============================================================ */

const newsContainer =
document.getElementById("news-container");

const paginationContainer =
document.getElementById("pagination");

const searchInput =
document.getElementById("search-news");

const categoryFilter =
document.getElementById("category-filter");


/* ============================================================
   STATE
============================================================ */

let allNews = [];

let filteredNews = [];

let currentPage = 1;


/* ============================================================
   LOADING
============================================================ */

function showLoading(){

    if(!newsContainer) return;

    let html="";

    for(let i=0;i<6;i++){

        html+=`

<div class="bg-white rounded-xl shadow animate-pulse overflow-hidden">

    <div class="h-56 bg-gray-200"></div>

    <div class="p-5">

        <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>

        <div class="h-6 bg-gray-200 rounded mb-3"></div>

        <div class="h-6 bg-gray-200 rounded w-5/6 mb-5"></div>

        <div class="h-4 bg-gray-200 rounded"></div>

    </div>

</div>

`;

    }

    newsContainer.innerHTML=html;

}


/* ============================================================
   ERROR
============================================================ */

function showError(message){

    newsContainer.innerHTML=`

<div class="col-span-full">

<div class="bg-red-50 border border-red-200 rounded-xl p-8 text-center">

<i class="fas fa-circle-exclamation text-red-600 text-5xl mb-4"></i>

<h2 class="text-2xl font-bold text-red-700 mb-3">

Terjadi Kesalahan

</h2>

<p class="text-gray-600">

${message}

</p>

</div>

</div>

`;

}

/* ============================================================
   HELPER
============================================================ */

function extractDriveId(url){

    if(!url) return null;

    if(url.includes("/d/")){

        return url.split("/d/")[1].split("/")[0];

    }

    const match=url.match(/[?&]id=([^&#]+)/);

    return match ? match[1] : null;

}



function buildImage(url){

    if(!url){
        return DEFAULT_IMAGE;
    }

    const id = extractDriveId(url);

    if(id){
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1600`;
    }

    return url;
}



function stripHtml(text=""){

    return text
        .replace(/<[^>]*>/g,"")
        .replace(/\s+/g," ")
        .trim();

}



function excerpt(text="",length=180){

    const clean=stripHtml(text);

    if(clean.length<=length){

        return clean;

    }

    return clean.substring(0,length)+"...";

}



function formatDate(value){

    if(!value){

        return "";

    }

    try{

        return new Date(value)
        .toLocaleDateString("id-ID",{

            day:"2-digit",

            month:"long",

            year:"numeric"

        });

    }

    catch{

        return value;

    }

}



/* ============================================================
   FETCH DATA GOOGLE SHEETS
============================================================ */

async function fetchNews(){

    showLoading();

    try{

        const response=await fetch(

            CONFIG.sheetUrl(CONFIG.spreadsheetId)

        );

        if(!response.ok){

            throw new Error("Gagal mengambil data Spreadsheet.");

        }

        const text=await response.text();

        const json=JSON.parse(

            text.substring(

                text.indexOf("{"),

                text.lastIndexOf("}")+1

            )

        );

        const rows=json.table.rows || [];

        allNews=[];

        rows.forEach(row=>{

            if(!row || !row.c) return;

            const timestamp=row.c[0]?.v || "";

            const title=row.c[1]?.v || "";

            const content=row.c[2]?.v || "";

            const image=row.c[3]?.v || "";

            const category=row.c[4]?.v || "Berita";

            const publish=row.c[5]?.v || timestamp;

            if(!title.trim()) return;

            const id=String(timestamp)

                .replace(/[^\d]/g,"");

            allNews.push({

                id,

                title,

                content,

                excerpt:excerpt(content),

                image:buildImage(image),

                category,

                publish,

                date:formatDate(publish)

            });

        });

        allNews.sort(

            (a,b)=>

            Number(b.id)-Number(a.id)

        );

        filteredNews=[...allNews];

        renderNews();

    }

    catch(error){

        console.error(error);

        showError(error.message);

    }

}

/* ============================================================
   RENDER CARD BERITA
============================================================ */

function renderNews(){

    if(!newsContainer) return;

    const totalPages =
        Math.ceil(filteredNews.length / CONFIG.pageSize);

    if(currentPage > totalPages && totalPages > 0){

        currentPage = totalPages;

    }

    const start =
        (currentPage - 1) * CONFIG.pageSize;

    const end =
        start + CONFIG.pageSize;

    const news =
        filteredNews.slice(start,end);

    if(news.length===0){

        newsContainer.innerHTML=`

<div class="col-span-full">

    <div class="bg-white rounded-xl shadow p-10 text-center">

        <i class="fas fa-newspaper text-6xl text-gray-300 mb-5"></i>

        <h2 class="text-2xl font-bold text-gray-700">

            Belum ada berita

        </h2>

        <p class="text-gray-500 mt-3">

            Tidak ada berita yang sesuai dengan pencarian Anda.

        </p>

    </div>

</div>

`;

        renderPagination();

        return;

    }

    let html="";

    news.forEach(item=>{

        html += `

<article class="news-card bg-white rounded-2xl shadow overflow-hidden hover:shadow-xl transition duration-300">

    <div class="relative">

        <img

            src="${item.image}"

            alt="${item.title}"

            loading="lazy"

            class="w-full h-60 object-cover"

            onerror="this.src='${DEFAULT_IMAGE}'">

        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

       

    </div>

    <div class="p-6">

        <div class="flex items-center text-sm text-gray-500 mb-3">

            <i class="far fa-calendar-alt mr-2"></i>

            ${item.date}

        </div>

        <h2 class="text-2xl font-bold text-gray-800 mb-4 line-clamp-2">

            ${item.title}

        </h2>

        <p class="text-gray-600 leading-7 mb-6">

            ${item.excerpt}

        </p>

        <div class="flex justify-between items-center">

            <a

                href="detail-berita.html?id=${item.id}"

                target="_blank"

                rel="noopener noreferrer"

                class="inline-flex items-center bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-xl transition">

                Baca Selengkapnya

                <i class="fas fa-arrow-right ml-2"></i>

            </a>

            <button

                onclick="copyNewsLink('${item.id}')"

                class="text-gray-500 hover:text-amber-700 transition"

                title="Salin Link">

                <i class="fas fa-link text-lg"></i>

            </button>

        </div>

    </div>

</article>

`;

    });

    newsContainer.innerHTML = html;

    renderPagination();

}

/* ============================================================
   PAGINATION
============================================================ */

function renderPagination(){

    if(!paginationContainer) return;

    const totalPages =
        Math.ceil(filteredNews.length / CONFIG.pageSize);

    if(totalPages <= 1){

        paginationContainer.innerHTML = "";

        return;

    }

    let html = `

<nav class="flex justify-center items-center gap-2 py-8">

`;

    /* Tombol Sebelumnya */

    html += `

<button

    class="px-4 py-2 rounded-lg border hover:bg-amber-700 hover:text-white transition
    ${currentPage===1 ? 'opacity-50 cursor-not-allowed' : ''}"

    ${currentPage===1 ? 'disabled' : ''}

    onclick="changePage(${currentPage-1})">

<i class="fas fa-chevron-left"></i>

</button>

`;

    /* Nomor Halaman */

    for(let i=1;i<=totalPages;i++){

        html += `

<button

    onclick="changePage(${i})"

    class="px-4 py-2 rounded-lg transition

    ${i===currentPage

        ? 'bg-amber-700 text-white'

        : 'border hover:bg-gray-100'

    }">

${i}

</button>

`;

    }

    /* Tombol Berikutnya */

    html += `

<button

    class="px-4 py-2 rounded-lg border hover:bg-amber-700 hover:text-white transition
    ${currentPage===totalPages ? 'opacity-50 cursor-not-allowed' : ''}"

    ${currentPage===totalPages ? 'disabled' : ''}

    onclick="changePage(${currentPage+1})">

<i class="fas fa-chevron-right"></i>

</button>

`;

    html += `

</nav>

`;

    paginationContainer.innerHTML = html;

}



/* ============================================================
   GANTI HALAMAN
============================================================ */

function changePage(page){

    currentPage = page;

    renderNews();

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



/* ============================================================
   SEARCH BERITA
============================================================ */

function searchNews(keyword){

    keyword = keyword.toLowerCase().trim();

    filteredNews = allNews.filter(item=>{

        return (

            item.title.toLowerCase().includes(keyword)

            ||

            item.content.toLowerCase().includes(keyword)

            ||

            item.category.toLowerCase().includes(keyword)

        );

    });

    currentPage = 1;

    renderNews();

}



/* ============================================================
   FILTER KATEGORI
============================================================ */

function filterCategory(category){

    if(category===""){

        filteredNews=[...allNews];

    }

    else{

        filteredNews=allNews.filter(item=>

            item.category===category

        );

    }

    currentPage=1;

    renderNews();

}



/* ============================================================
   COPY LINK
============================================================ */

async function copyNewsLink(id){

    const url =

        window.location.origin +

        BASE_PATH +

        `detail-berita.html?id=${id}`;

    try{

        await navigator.clipboard.writeText(url);

        alert("Link berita berhasil disalin.");

    }

    catch{

        prompt("Salin link berikut:",url);

    }

}

/* ============================================================
   MEMBANGUN FILTER KATEGORI OTOMATIS
============================================================ */

function buildCategoryFilter(){

    if(!categoryFilter) return;

    const categories = [
        ...new Set(
            allNews.map(item => item.category)
        )
    ].sort();

    let html = `
        <option value="">
            Semua Kategori
        </option>
    `;

    categories.forEach(category => {

        html += `
            <option value="${category}">
                ${category}
            </option>
        `;

    });

    categoryFilter.innerHTML = html;

}



/* ============================================================
   EVENT PENCARIAN
============================================================ */

if(searchInput){

    searchInput.addEventListener("input", function(){

        searchNews(this.value);

    });

}



/* ============================================================
   EVENT FILTER KATEGORI
============================================================ */

if(categoryFilter){

    categoryFilter.addEventListener("change", function(){

        filterCategory(this.value);

    });

}



/* ============================================================
   REFRESH DATA
============================================================ */

async function refreshNews(){

    try{

        await fetchNews();

    }

    catch(error){

        console.error(error);

    }

}



/* ============================================================
   INISIALISASI HALAMAN
============================================================ */

document.addEventListener("DOMContentLoaded", async ()=>{

    if(!newsContainer) return;

    await fetchNews();

    buildCategoryFilter();

});



/* ============================================================
   UTILITAS
============================================================ */

function getNewsById(id){

    return allNews.find(item=>item.id===id);

}



function getLatestNews(limit=5){

    return allNews.slice(0,limit);

}



function totalNews(){

    return allNews.length;

}



/* ============================================================
   EXPORT (Opsional)
============================================================ */

window.NewsApp = {

    refresh: refreshNews,

    getAll: ()=>allNews,

    getById: getNewsById,

    latest: getLatestNews,

    total: totalNews

};

/* ============================================================
   OPTIMASI PENCARIAN (DEBOUNCE)
============================================================ */

function debounce(callback, delay = 300){

    let timeout;

    return (...args)=>{

        clearTimeout(timeout);

        timeout = setTimeout(()=>{

            callback(...args);

        }, delay);

    };

}


/* ============================================================
   PASANG DEBOUNCE KE SEARCH
============================================================ */

if(searchInput){

    searchInput.removeEventListener("input", searchNews);

    searchInput.addEventListener(

        "input",

        debounce(function(e){

            searchNews(e.target.value);

        },300)

    );

}


/* ============================================================
   CEK DATA KOSONG
============================================================ */

function validateNewsData(){

    if(allNews.length===0){

        newsContainer.innerHTML=`

<div class="col-span-full">

<div class="bg-white rounded-2xl shadow-lg p-12 text-center">

<i class="fas fa-newspaper text-6xl text-gray-300 mb-5"></i>

<h2 class="text-3xl font-bold text-gray-700">

Belum Ada Berita

</h2>

<p class="text-gray-500 mt-3">

Data berita belum tersedia.

Silakan isi Google Form terlebih dahulu.

</p>

</div>

</div>

`;

        return false;

    }

    return true;

}


/* ============================================================
   REFRESH HALAMAN
============================================================ */

window.addEventListener("focus",()=>{

    // Otomatis refresh ketika kembali dari tab lain

    refreshNews();

});


/* ============================================================
   PRELOAD GAMBAR
============================================================ */

function preloadImages(limit=3){

    allNews

    .slice(0,limit)

    .forEach(item=>{

        const img = new Image();

        img.src=item.image;

    });

}


/* ============================================================
   UPDATE FETCH NEWS
============================================================ */

const _oldFetchNews = fetchNews;

fetchNews = async function(){

    await _oldFetchNews();

    if(validateNewsData()){

        preloadImages();

    }

}


/* ============================================================
   BACK TO TOP
============================================================ */

const backTop=document.getElementById("backToTop");

if(backTop){

    window.addEventListener("scroll",()=>{

        if(window.scrollY>500){

            backTop.classList.remove("hidden");

        }

        else{

            backTop.classList.add("hidden");

        }

    });

    backTop.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}


/* ============================================================
   INFORMASI VERSI
============================================================ */

console.log(

"%cWebsite Kecamatan Makale",

"color:#b45309;font-size:18px;font-weight:bold"

);

console.log(

"%cSistem Berita v2.0 Aktif",

"color:green;font-size:14px"

);

console.log(
"Total berita :", totalNews()
);

/* ============================================================
   COPY LINK BERITA
============================================================ */


/* ============================================================
   END OF FILE
============================================================ */
