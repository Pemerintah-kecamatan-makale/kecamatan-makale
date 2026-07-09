const API =
"https://script.google.com/macros/s/AKfycbyvaAvWB2_ACWwN3Bk7fOezihnbLMZ_PmJ6Earj2y122Jsyt6RqbCKTPzKc30BW8J0rSw/exec?dashboard=1";

let chart;

async function loadDashboard(){

    const res = await fetch(API);
    const d = await res.json();

    document.getElementById("responden").innerHTML = d.responden;
    document.getElementById("ikm").innerHTML = Number(d.ikm).toFixed(2);
    document.getElementById("mutu").innerHTML = d.mutu;
    document.getElementById("kategori").innerHTML = d.kategori;

    if(chart) chart.destroy();

    chart = new Chart(document.getElementById("grafikSKM"),{

        type:"bar",

        data:{

            labels:["U1","U2","U3","U4","U5","U6","U7","U8","U9"],

            datasets:[{

                label:"Nilai Unsur",

                data:[
                    d.u1,d.u2,d.u3,d.u4,d.u5,
                    d.u6,d.u7,d.u8,d.u9
                ],

                backgroundColor:"#991b1b"

            }]

        },

        options:{

            plugins:{
                legend:{display:false}
            },

            scales:{
                y:{
                    beginAtZero:true,
                    max:4
                }
            }

        }

    });

}

loadDashboard();

setInterval(loadDashboard,60000);
