const renderManaCurve = () => {
    // console.log('renderManaCurve executed');
    const ctx = document.getElementById('myChart').getContext('2d');
    const cardData = manaCurve();
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1', '2', '3', '4', '5', '6+'],
            datasets: [{
                label: 'No. of cards',
                data: cardData,
                backgroundColor: 'hsl(120,100%, 50%)',
                borderWidth: 0,
                // barThickness: 50//,
                categoryPercentage: 0.9,
                barPercentage: 0.8
            }]
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        beginAtZero: true,
                        display: false
                    }   
                }]
            }
        }
    });
    // console.log('cardData in renderManaCurve func',cardData);
}