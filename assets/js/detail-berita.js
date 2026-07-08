/* ==========================================================
   detail-berita.js
   Website Resmi Kecamatan Makale
========================================================== */

/* ===============================
   KONFIGURASI
================================ */

const SPREADSHEET_ID = "1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ";

const JSON_URL =
`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json`;

const isGitHubPages =
window.location.hostname.includes("github.io");

const BASE_PATH =
isGitHubPages
? "/kecamatan-makale/"
: "/";

const DEFAULT_IMAGE =
BASE_PATH + "Plaza Kolam Makale.jpg";

const container =
document.getElementById("detail-container");

const NEWS_ID =
new URLSearchParams(window.location.search)
.get("id");

let allNews = [];



/* ===============================
   HELPER
================================ */

function extractDriveId(url){

    if(!url) return null;

    if(url.includes("/d/")){

        return url.split("/d/")[1].split("/")[0];

    }

    const match =
    url.match(/[?&]id=([^&#]+)/);

    if(match){

        return match[1];

    }

    return null;

}



function buildImage(url){

    if(!url){

        return DEFAULT_IMAGE;

    }

    const id =
    extractDriveId(url);

    if(id){

        return `https://drive.google.com/thumbnail?id=${id}&sz=w1400`;

    }

    return url;

}



function formatTanggal(row){

    const manual =
    row.c[5]
    ? (row.c[5].f || row.c[5].v || "")
    : "";

    if(manual.trim()!=""){

        return manual;

    }

    const ts =
    row.c[0]
    ? (row.c[0].f || row.c[0].v || "")
    : "";

    return ts.split(" ")[0];

}



function formatContent(text){

    if(!text) return "";

    return text

    .split(/\n\s*\n/)

    .map(item=>`<p class="mb-5">${item.replace(/\n/g,"<br>")}</p>`)

    .join("");

}

/* ===============================
   LOADING & ERROR
================================ */

function showLoading() {

    container.innerHTML = `
    <div class="text-center py-20">
        <i class="fas fa-spinner fa-spin text-5xl text-amber-700"></i>
        <p class="mt-4 text-gray-500">
            Memuat berita...
        </p>
    </div>`;
}


function showNotFound() {

    container.innerHTML = `
    <div class="text-center py-20">

        <i class="fas fa-newspaper
                  text-6xl
                  text-gray-300"></i>

        <h2 class="text-3xl
                   font-bold
                   mt-5">

            Berita tidak ditemukan

        </h2>

        <p class="mt-3 text-gray-500">

            Berita yang Anda cari tidak tersedia.

        </p>

        <a href="berita.html"
           class="inline-block
                  mt-8
                  bg-amber-700
                  hover:bg-amber-800
                  text-white
                  px-6
                  py-3
                  rounded-xl">

            ← Kembali ke Daftar Berita

        </a>

    </div>`;
}



/* ===============================
   AMBIL DATA SPREADSHEET
================================ */

async function loadNews() {

    showLoading();

    try {

        const response =
            await fetch(JSON_URL);

        const text =
            await response.text();

        const json =
            JSON.parse(
                text.substring(
                    text.indexOf("{"),
                    text.lastIndexOf("}") + 1
                )
            );

        const rows =
            json.table.rows || [];

        allNews = [];

        rows.reverse().forEach(row => {

            if (!row || !row.c) return;

            const rawTimestamp =
                row.c[0]?.v || "";

            const id =
                String(rawTimestamp)
                .replace(/[^0-9]/g, "");

            const title =
                row.c[1]?.v || "";

            const content =
                row.c[2]?.v || "";

            if (
                title.trim() === "" ||
                content.trim() === "" ||
                title === "Judul"
            ) {
                return;
            }

            allNews.push({

                id,

                title,

                date:
                    formatTanggal(row),

                image:
                    buildImage(
                        row.c[3]?.v || ""
                    ),

                content

            });

        });

        const currentNews =
            allNews.find(item =>
                item.id === NEWS_ID
            );

        if (!currentNews) {

            showNotFound();

            return;

        }

        document.title =
            currentNews.title +
            " | Kecamatan Makale";

        renderDetail(currentNews);

    }

    catch (error) {

        console.error(error);

        showNotFound();

    }

}

/* ===============================
   TAMPILKAN DETAIL BERITA
================================ */

function renderDetail(news) {

    const html = `

<nav class="text-sm text-gray-500 mb-6">

    <a href="index.html"
       class="hover:text-amber-700">

        Beranda

    </a>

    <span class="mx-2">/</span>

    <a href="berita.html"
       class="hover:text-amber-700">

        Berita

    </a>

    <span class="mx-2">/</span>

    <span class="text-gray-700 font-medium">

        ${news.title}

    </span>

</nav>


<article
class="bg-white
rounded-2xl
shadow-lg
overflow-hidden">

    <img

        src="${news.image}"

        alt="${news.title}"

        class="w-full
               max-h-[520px]
               object-cover"

        onerror="this.src='${DEFAULT_IMAGE}'">

    <div class="p-8">

        <div
        class="flex
               flex-wrap
               items-center
               gap-4
               text-sm
               text-gray-500
               mb-5">

            <span>

                <i class="far fa-calendar-alt"></i>

                ${news.date}

            </span>

            <span>

                <i class="fas fa-building"></i>

                Kecamatan Makale

            </span>

        </div>


        <h1
        class="text-4xl
               font-black
               text-gray-900
               leading-tight
               mb-8">

            ${news.title}

        </h1>


        <div
        class="prose
               prose-lg
               max-w-none
               text-gray-700
               leading-8">

            ${formatContent(news.content)}

        </div>


        <hr class="my-10">


        <div
        class="flex
               flex-wrap
               justify-between
               items-center
               gap-3">

            <div class="flex gap-3">

                <button

                    onclick="shareNews()"

                    class="bg-blue-600
                           hover:bg-blue-700
                           text-white
                           px-5
                           py-3
                           rounded-xl">

                    <i class="fas fa-share-alt mr-2"></i>

                    Bagikan

                </button>

            </div>


            <div>

                <a

                    href="berita.html"

                    class="bg-amber-700
                           hover:bg-amber-800
                           text-white
                           px-5
                           py-3
                           rounded-xl">

                    ← Kembali ke Daftar Berita

                </a>

            </div>

        </div>

    </div>

</article>

`;

    container.innerHTML = html;

}

/* ===============================
   SHARE BERITA
================================ */

async function shareNews() {

    const shareData = {
        title: document.title,
        text: document.title,
        url: window.location.href
    };

    try {

        if (navigator.share) {

            await navigator.share(shareData);

        } else if (navigator.clipboard) {

            await navigator.clipboard.writeText(window.location.href);

            alert("Link berita berhasil disalin.");

        } else {

            prompt("Salin link berikut:", window.location.href);

        }

    } catch (err) {

        console.log("Share dibatalkan.");

    }

}



/* ===============================
   NAVIGASI BERITA
================================ */

function previousNews() {

    const index =
        allNews.findIndex(item => item.id === NEWS_ID);

    if (index < 0) return;

    if (index < allNews.length - 1) {

        window.location.href =
            `detail-berita.html?id=${allNews[index + 1].id}`;

    } else {

        alert("Ini adalah berita paling lama.");

    }

}



function nextNews() {

    const index =
        allNews.findIndex(item => item.id === NEWS_ID);

    if (index <= 0) {

        alert("Ini adalah berita terbaru.");

        return;

    }

    window.location.href =
        `detail-berita.html?id=${allNews[index - 1].id}`;

}



/* ===============================
   KEYBOARD SHORTCUT
================================ */

document.addEventListener("keydown", function (e) {

    if (e.key === "ArrowLeft") {

        previousNews();

    }

    if (e.key === "ArrowRight") {

        nextNews();

    }

});



/* ===============================
   SCROLL KE ATAS
================================ */

window.addEventListener("load", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});



/* ===============================
   START
================================ */

document.addEventListener("DOMContentLoaded", () => {

    if (!NEWS_ID) {

        showNotFound();

        return;

    }

    loadNews();

});
