const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const width = 400; //px
const height = 300; //px
const backgroundColour = 'white';
const chartJSNodeCanvas = new ChartJSNodeCanvas({ 
    width, height, backgroundColour,
    plugins: {
        modern: [require('chartjs-plugin-datalabels'),require('chartjs-plugin-annotation')]
    },

});

module.exports = async (xValues = [], yValues = [], average = 0, minimize = false) => {
    const configuration = {
        type: "line",
        data: {
          labels: xValues,
          datasets: [{
            label: `Your average water consumption per month is ${average} cubic meters`,
            fill: false,
            backgroundColor: "black",
            data: yValues,
          }]
        },
        options:{
            layout: {
                padding: 20
            },
            plugins:{   
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 0,
                        font: {
                            weight: '600',
                            size: minimize ? 9:12,
                        }
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    labels: {
                      value: {
                        color: 'black'
                      }
                    },
                    font: {
                        size: minimize ? 7:8,
                    }
                },
            },
            scales: {
                x: {
                    ticks: {
                        font: { size: minimize ? 7:10 }
                    }
                },
                y: {
                    ticks: {
                        font: { size: minimize ? 7:10 }
                    }
                }
            },
            devicePixelRatio: 2
        }
    };
    return await chartJSNodeCanvas.renderToDataURL(configuration);
}