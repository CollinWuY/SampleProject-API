$(document).ready(function() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth();
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }


    let dateQuery = `${yyyy}-${mm}-${dd}`;
    $.ajax({
        method: "GET",
        dataType: "json",
        contentType: "text/plain",
        url: `https://api.data.gov.sg/v1/environment/psi?date=${dateQuery}`,
        success: function(data) {
            console.log(data);

            let psi_twenty_four_hourly = data.items[0].readings.psi_twenty_four_hourly;
            let psi_twenty_four_hourly_national = data.items[0].readings.psi_twenty_four_hourly.national;


            let quality = getPSIColor(psi_twenty_four_hourly_national);
            console.log("Quality:" + quality);
            $(".latest-psi-status").addClass(`psi-${quality}`);
            $(".latest-psi-state").addClass(`psi-${quality}`);
            $(".stats-placeholder").addClass(`psi-${quality}`);
            $('.latest-psi-state').html(psi_twenty_four_hourly_national);
            $('.latest-psi-time').html(`on ${dateQuery}`);

            //set local storage

            localStorage.setItem("eastPSI", psi_twenty_four_hourly.east);
            localStorage.setItem("westPSI", psi_twenty_four_hourly.west);
            localStorage.setItem("northPSI", psi_twenty_four_hourly.north);
            localStorage.setItem("centralPSI", psi_twenty_four_hourly.national);
            localStorage.setItem("southPSI", psi_twenty_four_hourly.south);


        },



    });

    function getPSIColor(psiValue) {
        if (psiValue >= 0 && psiValue <= 50) {
            return "good";
        } else if (psiValue >= 51 && psiValue <= 100) {
            return "moderate";
        } else if (psiValue >= 101 && psiValue <= 200) {
            return "unhealthy";
        } else if (psiValue >= 201 && psiValue <= 300) {
            return "very-unhealthy";
        } else if (psiValue >= 301) {
            return "hazardous"
        } else {
            console.log("invalid psi value");
        }

    }


})