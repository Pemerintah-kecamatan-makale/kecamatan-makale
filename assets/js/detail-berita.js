/* ==========================================================
   detail-berita.js
   Website Resmi Kecamatan Makale
========================================================== */

// ===============================
// KONFIGURASI
// ===============================

const SPREADSHEET_ID = "1Y2qLpJf_82-5i5EOfQYnfD_tV-oNJtc217pvNeyBJaQ";

const SHEET_URL =
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


// ===============================
// AMBIL PARAMETER URL
// ===============================

const params =
new URLSearchParams(window.location.search);

const NEWS_ID =
params.get("id");


// ===============================
// HELPER
// ===============================

function extractDriveId(url){

    if(!url) return null;

    if(url.includes("/d/")){

        const part =
        url.split("/d/")[1];

        return part.split("/")[0];

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



// ===============================
// LOADING
// ===============================

function loading(){

container.innerHTML=`

<div class="text-center py-24">

<i class="fas fa-spinner fa-spin
text-5xl text-amber-700"></i>

<p class="mt-5">

Memuat berita...

</p>

</div>

`;

}



// ===============================
// ERROR
// ===============================

function show404(){

container.innerHTML=`

<div class="text-center py-24">

<i class="fas fa-newspaper
text-6xl
text-gray-300"></i>

<h2
class="text-3xl
font-bold
mt-6">

Berita tidak ditemukan

</h2>

<p
class="mt-3
text-gray-500">

Data berita tidak tersedia.

</p>

<a

href="berita.html"

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

</div>

`;

}
/* ==========================================================
   BAGIAN B
   Memuat Detail Berita
========================================================== */

async function loadNewsDetail() {

    loading();

    try {

        const response = await fetch(SHEET_URL);

        const text = await response.text();

        const json = JSON.parse(
            text.substring(
                text.indexOf("{"),
                text.lastIndexOf("}") + 1
            )
        );

        const rows = json.table.rows || [];

        let berita = null;

        rows.forEach(row => {

            if (!row || !row.c) return;

            const rawTimestamp = row.c[0]?.v || "";

            const id = String(rawTimestamp)
                .replace(/[^0-9]/g, "");

            if (id !== NEWS_ID) return;

            berita = {

                id: id,

                title: row.c[1]?.v || "",

                content: row.c[2]?.v || "",

                image: buildImage(
                    row.c[3]?.v || ""
                ),

                date: formatTanggal(row)

            };

        });

        if (!berita) {

            show404();
            return;

        }

        document.title =
            berita.title +
            " | Kecamatan Makale";

        renderDetail(berita);

    }

    catch (err) {

        console.error(err);

        show404();

    }

}



/* ==========================================================
   TAMPILKAN DETAIL BERITA
========================================================== */

function renderDetail(news) {

    container.innerHTML = `

<article
class="bg-white
rounded-2xl
shadow-md
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
        class="text-sm
        text-gray-500
        mb-3">

            <i class="far fa-calendar-alt"></i>

            ${news.date}

        </div>

        <h1
        class="text-4xl
        font-black
        text-gray-900
        leading-tight
        mb-6">

            ${news.title}

        </h1>

        <div
        class="prose
        max-w-none
        text-justify
        leading-8
        text-gray-700
        whitespace-pre-line">

            ${news.content}

        </div>

        <div
        class="border-t
        mt-10
        pt-6">

            <a

            href="berita.html"

            class="inline-flex
                   items-center
                   gap-2
                   bg-amber-700
                   hover:bg-amber-800
                   text-white
                   px-5
                   py-3
                   rounded-xl">

                <i class="fas fa-arrow-left"></i>

                Kembali ke Daftar Berita

            </a>

        </div>

    </div>

</article>

`;

}
/* ==========================================================
   BAGIAN C
   Navigasi, Share & Inisialisasi
========================================================== */

let newsList = [];

/**
 * Membuat paragraf HTML dari isi berita
 */
function formatContent(text) {

    if (!text) return "";

    return text
        .split(/\n\s*\n/)
        .map(p => `<p class="mb-5">${p.replace(/\n/g,"<br>")}</p>`)
        .join("");

}


/**
 * Tombol Share
 */
function shareNews() {

    if (navigator.share) {

        navigator.share({

            title: document.title,

            text: document.title,

            url: window.location.href

        });

    } else {

        navigator.clipboard.writeText(window.location.href);

        alert("Link berita berhasil disalin.");

    }

}


/**
 * Berita Sebelumnya
 */
function previousNews(currentId) {

    const index =
        newsList.findIndex(n => n.id === currentId);

    if (index < newsList.length - 1) {

        window.location.href =
            "detail-berita.html?id=" +
            newsList[index + 1].id;

    }

}


/**
 * Berita Berikutnya
 */
function nextNews(currentId) {

    const index =
        newsList.findIndex(n => n.id === currentId);

    if (index > 0) {

        window.location.href =
            "detail-berita.html?id=" +
            newsList[index - 1].id;

    }

}


/* ==========================================================
   Render Detail (Versi Lengkap)
========================================================== */

function renderDetail(news) {

    news.content = formatContent(news.content);

    container.innerHTML = `

<nav class="text-sm text-gray-500 mb-5">

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

<span class="text-gray-700">

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

class="w-full
max-h-[520px]
object-cover"

onerror="this.src='${DEFAULT_IMAGE}'">


<div class="p-8">

<div
class="text-sm
text-gray-500
mb-3">

<i class="far fa-calendar-alt"></i>

${news.date}

</div>

<h1
class="text-4xl
font-black
leading-tight
mb-8">

${news.title}

</h1>

<div
class="text-gray-700
leading-8
text-justify">

${news.content}

</div>

<div
class="border-t
mt-10
pt-8
flex
flex-wrap
gap-3
justify-between">

<div class="flex gap-3">

<button

onclick="previousNews('${news.id}')"

class="px-5
py-3
rounded-xl
bg-gray-100
hover:bg-gray-200">

← Sebelumnya

</button>

<button

onclick="nextNews('${news.id}')"

class="px-5
py-3
rounded-xl
bg-gray-100
hover:bg-gray-200">

Berikutnya →

</button>

</div>

<div class="flex gap-3">

<button

onclick="shareNews()"

class="px-5
py-3
rounded-xl
bg-blue-600
text-white
hover:bg-blue-700">

<i class="fas fa-share-alt"></i>

Bagikan

</button>

<a

href="berita.html"

class="px-5
py-3
rounded-xl
bg-amber-700
text-white
hover:bg-amber-800">

← Daftar Berita

</a>

</div>

</div>

</div>

</article>

`;

}


/* ==========================================================
   Ambil seluruh berita
========================================================== */

async function loadNewsDetail() {

    loading();

    try {

        const response =
            await fetch(SHEET_URL);

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

        newsList = [];

        let berita = null;

        rows.reverse().forEach(row => {

            if (!row || !row.c) return;

            const raw =
                row.c[0]?.v || "";

            const id =
                String(raw).replace(/[^0-9]/g,"");

            const item = {

                id,

                title:
                row.c[1]?.v || "",

                content:
                row.c[2]?.v || "",

                image:
                buildImage(
                    row.c[3]?.v || ""
                ),

                date:
                formatTanggal(row)

            };

            newsList.push(item);

            if(id===NEWS_ID){

                berita = item;

            }

        });

        if(!berita){

            show404();

            return;

        }

        document.title =
        berita.title +
        " | Kecamatan Makale";

        renderDetail(berita);

    }

    catch(err){

        console.error(err);

        show404();

    }

}


/* ==========================================================
   START
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadNewsDetail();

});
