const API_URL = "https://script.google.com/macros/s/AKfycbxegawUQCOUAZlPYWafxD-k5oCXKcO-JwNBtTXrQqHkl1GRabg-8KyBiYqqh_rG9akxmg/exec";

document.getElementById("formSKM").addEventListener("submit", function(e){

    e.preventDefault();

    const btn = document.getElementById("btnKirim");

    btn.disabled = true;
    btn.innerHTML = "Mengirim...";

    const data = {

        nama : document.getElementById("nama").value,
        umur : document.getElementById("umur").value,
        jk : document.getElementById("jk").value,
        layanan : document.getElementById("layanan").value,

        u1 : document.getElementById("u1").value,
        u2 : document.getElementById("u2").value,
        u3 : document.getElementById("u3").value,
        u4 : document.getElementById("u4").value,
        u5 : document.getElementById("u5").value,
        u6 : document.getElementById("u6").value,
        u7 : document.getElementById("u7").value,
        u8 : document.getElementById("u8").value,
        u9 : document.getElementById("u9").value,

        saran : document.getElementById("saran").value

    };

    fetch(API_URL,{

        method:"POST",

        body:JSON.stringify(data)

    })

    .then(res=>res.json())

    .then(res=>{

        if(res.status=="success"){

            alert("Terima kasih.\n\nSurvei berhasil dikirim.");

            document.getElementById("formSKM").reset();

        }else{

            alert("Gagal mengirim data.");

        }

    })

    .catch(err=>{

        alert("Terjadi kesalahan koneksi.");

        console.log(err);

    })

    .finally(()=>{

        btn.disabled=false;

        btn.innerHTML="Kirim Survei";

    });

});
