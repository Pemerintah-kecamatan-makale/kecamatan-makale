/* ==========================================================
   PRELOAD GAMBAR
========================================================== */

function preloadImage(){

    if(!currentNews) return;

    const img = new Image();

    img.src = currentNews.image;

}


/* ==========================================================
   SCROLL KE ATAS
========================================================== */

function scrollTopPage(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}


/* ==========================================================
   SEO
========================================================== */

function updateMeta(){

    if(!currentNews) return;

    let description =
        currentNews.content
        .replace(/<[^>]*>/g,"")
        .replace(/\n/g," ")
        .trim();

    if(description.length>160){

        description =
            description.substring(0,160)+"...";

    }

    let meta =
        document.querySelector(
            'meta[name="description"]'
        );

    if(!meta){

        meta=document.createElement("meta");

        meta.name="description";

        document.head.appendChild(meta);

    }

    meta.content=description;

}


/* ==========================================================
   VALIDASI PARAMETER
========================================================== */

function validateParameter(){

    if(!NEWS_ID){

        showError(

            "Parameter berita tidak ditemukan."

        );

        return false;

    }

    return true;

}


/* ==========================================================
   INIT
========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        if(!container) return;

        if(!validateParameter()) return;

        await fetchNews();

        updateMeta();

        preloadImage();

        scrollTopPage();

    }

);


/* ==========================================================
   UTILITAS
========================================================== */

window.DetailNews={

    reload:fetchNews,

    current:()=>currentNews,

    list:()=>allNews

};


/* ==========================================================
   DEBUG
========================================================== */

console.log(

"%cWebsite Kecamatan Makale",

"color:#b45309;font-size:18px;font-weight:bold"

);

console.log(

"%cDetail Berita v2.0 Aktif",

"color:green;font-size:14px"

);


/* ==========================================================
   END OF FILE
========================================================== */
