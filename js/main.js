$(document).ready(function() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }


    let dateQuery = `${yyyy}-${mm}-${dd}`;

    //dataset for chart pm2.5 hour
    let pm25 = [];



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

            for (let i = 0; i < data.items.length; i++) {
                //pm25-sub_index
                pm25.push(data.items[i].readings.pm25_sub_index);
            }
            console.log("PM25 size: " + pm25.length);
            console.log(pm25);
            console.log(myChart.data.datasets[0].data);

            let pm25national = [];
            for (let i = 0; i < pm25.length; i++) {
                pm25national.push(pm25[i].national);
            }

            let pm25labels = [];
            for (let i = 0; i < pm25.length; i++) {
                pm25labels.push(i);
            }

            let psiMax = Math.max(...myChart.data.datasets[0].data);
            let psiMin = Math.min(...myChart.data.datasets[0].data);

            console.log(pm25national);
            myChart.data.datasets[0].data = pm25national;
            myChart.data.labels = pm25labels;
            myChart.update();

            /*
            Change Chart Type

            let sampleData = myChart.data;
            let sampleOptions = myChart.options;
            myChart.destroy();
            myChart = new Chart(ctx,
                    {
                    type:'line',
                    data:sampleData,
                    options: sampleOptions
                    });
            myChart.update();
            */
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