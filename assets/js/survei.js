/**
 * ============================================================
 * SURVEI.JS
 * Dashboard & Form SKM Kecamatan Makale
 * ============================================================
 */

const API_URL =
"https://script.google.com/macros/s/AKfycbyvaAvWB2_ACWwN3Bk7fOezihnbLMZ_PmJ6Earj2y122Jsyt6RqbCKTPzKc30BW8J0rSw/exec?dashboard=1";

let chartSKM = null;

/* ===========================================================
   DASHBOARD
=========================================================== */

async function loadDashboard() {

    try {

        const response = await fetch(API_URL,{cache:"no-store"});

        if(!response.ok){
            throw new Error("Gagal mengambil data dashboard.");
        }

        const data = await response.json();

        document.getElementById("responden").textContent =
            data.responden ?? 0;

        document.getElementById("ikm").textContent =
            Number(data.ikm ?? 0).toFixed(2);

        let mutu = data.mutu ?? "-";

        switch(mutu){

            case "A":
                mutu = "Sangat Baik";
                break;

            case "B":
                mutu = "Baik";
                break;

            case "C":
                mutu = "Kurang Baik";
                break;

            case "D":
                mutu = "Tidak Baik";
                break;
        }

        document.getElementById("mutu").textContent = mutu;

        document.getElementById("kategori").textContent =
            data.kategori ?? "-";

        renderChart(data);

    } catch(err){

        console.error(err);

    }

}

/* ===========================================================
   CHART
=========================================================== */

function renderChart(data){

    const canvas=document.getElementById("ikmChart");

    if(!canvas) return;

    if(chartSKM){
        chartSKM.destroy();
    }

    chartSKM=new Chart(canvas,{

        type:"bar",

        data:{

            labels:[
                "U1","U2","U3",
                "U4","U5","U6",
                "U7","U8","U9"
            ],

            datasets:[{

                label:"Nilai Unsur",

                data:[

                    Number(data.u1||0),
                    Number(data.u2||0),
                    Number(data.u3||0),
                    Number(data.u4||0),
                    Number(data.u5||0),
                    Number(data.u6||0),
                    Number(data.u7||0),
                    Number(data.u8||0),
                    Number(data.u9||0)

                ],

                backgroundColor:"#991b1b",

                borderRadius:5

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{
                legend:{
                    display:false
                }
            },

            scales:{

                y:{
                    min:0,
                    max:4,
                    ticks:{
                        stepSize:1
                    }
                }

            }

        }

    });

}

/* ===========================================================
   SUBMIT FORM
=========================================================== */

async function kirimSurvei(e){

    e.preventDefault();

    const payload={

        nama:document.getElementById("nama").value.trim() || "Anonim",

        umur:document.getElementById("umur").value,

        jk:document.getElementById("jk").value,

        layanan:document.getElementById("layanan").value,

        u1:document.getElementById("u1").value,
        u2:document.getElementById("u2").value,
        u3:document.getElementById("u3").value,
        u4:document.getElementById("u4").value,
        u5:document.getElementById("u5").value,
        u6:document.getElementById("u6").value,
        u7:document.getElementById("u7").value,
        u8:document.getElementById("u8").value,
        u9:document.getElementById("u9").value,

        saran:document.getElementById("saran").value.trim()

    };

    for(const key of [
        "umur","jk","layanan",
        "u1","u2","u3","u4","u5","u6","u7","u8","u9"
    ]){

        if(!payload[key]){

            alert("Mohon lengkapi seluruh isian.");

            return;

        }

    }

    const tombol=document.getElementById("btnKirim");

    tombol.disabled=true;

    tombol.innerHTML="Mengirim...";

    try{

        const response=await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify(payload)

        });

        const hasil=await response.json();

        if(hasil.status==="success"){

            alert("Terima kasih. Survei berhasil dikirim.");

            document.getElementById("formSKM").reset();

            await loadDashboard();

        }else{

            throw new Error(hasil.message);

        }

    }catch(err){

        console.error(err);

        alert("Gagal mengirim data.");

    }

    tombol.disabled=false;

    tombol.innerHTML='<i class="fas fa-paper-plane mr-2"></i> Kirim Survei';

}

/* ===========================================================
   START
=========================================================== */

document.addEventListener("DOMContentLoaded",()=>{

    loadDashboard();

    setInterval(loadDashboard,60000);

    const form=document.getElementById("formSKM");

    if(form){

        form.addEventListener("submit",kirimSurvei);

    }

});
