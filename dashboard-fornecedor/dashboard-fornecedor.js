document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('performanceChart');
    const periodFilter = document.getElementById('periodFilter');
    const chartTitle = document.getElementById('chartTitle');
    const chartLegend = document.getElementById('chartLegend');
    
    function generateDailyLabels(days) {
        const labels = [];
        for (let i = days; i >= 1; i--) {
            labels.push(`Dia ${i}`);
        }
        return labels;
    }
    
    const chartData = {
        7: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            leadsValidos: [45, 52, 38, 65, 58, 23, 15],
            contestacoes: [2, 1, 3, 1, 2, 0, 0],
            max: 70
        },
        30: {
            labels: generateDailyLabels(30),
            leadsValidos: [42, 48, 35, 52, 61, 38, 29, 45, 58, 52, 41, 55, 62, 48, 33, 49, 57, 44, 51, 59, 46, 38, 42, 56, 48, 35, 41, 53, 47, 39],
            contestacoes: [2, 1, 3, 2, 1, 2, 1, 2, 1, 3, 2, 1, 2, 1, 3, 2, 1, 2, 1, 2, 3, 1, 2, 1, 2, 1, 3, 2, 1, 2],
            max: 70
        },
        90: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Sem 9', 'Sem 10', 'Sem 11', 'Sem 12', 'Sem 13'],
            leadsValidos: [320, 285, 350, 310, 340, 295, 365, 330, 315, 355, 300, 345, 325],
            contestacoes: [12, 8, 15, 10, 13, 9, 14, 11, 8, 16, 10, 12, 9],
            max: 400
        }
    };
    
    let chart;
    
    function updateChart(period) {
        const data = chartData[period];
        
        chart.data.labels = data.labels;
        chart.data.datasets[0].data = data.leadsValidos;
        chart.data.datasets[1].data = data.contestacoes;
        chart.options.scales.y.max = data.max;
        
        if (period === 7) {
            chart.options.scales.y.ticks.stepSize = 10;
        } else if (period === 30) {
            chart.options.scales.y.ticks.stepSize = 10;
        } else {
            chart.options.scales.y.ticks.stepSize = 50;
        }
        
        if (period === 30) {
            chart.options.scales.x.ticks = {
                maxTicksLimit: 15
            };
        } else {
            chart.options.scales.x.ticks = {};
        }
        
        chart.update();
        
        chartTitle.textContent = `Performance de Envios (Últimos ${period} dias)`;
    }
    
    function createLegend() {
        chartLegend.innerHTML = '';
        
        chart.data.datasets.forEach((dataset, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'd-flex align-items-center legend-item';
            legendItem.style.cursor = 'pointer';
            legendItem.dataset.index = index;
            
            const isHidden = chart.getDatasetMeta(index).hidden;
            const opacity = isHidden ? 0.3 : 1;
            
            legendItem.innerHTML = `
                <div class="legend-color me-2" style="background-color: ${dataset.backgroundColor}; width: 12px; height: 12px; border-radius: 2px; opacity: ${opacity};"></div>
                <span class="text-gray-600 fs-7" style="opacity: ${opacity};">${dataset.label}</span>
            `;
            
            legendItem.addEventListener('click', function() {
                const meta = chart.getDatasetMeta(index);
                meta.hidden = !meta.hidden;
                chart.update();
                createLegend();
            });
            
            chartLegend.appendChild(legendItem);
        });
    }
    
    if (ctx) {
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData[7].labels,
                datasets: [
                    {
                        label: 'Leads Válidos',
                        data: chartData[7].leadsValidos,
                        backgroundColor: '#ff007a',
                        borderRadius: 4
                    },
                    {
                        label: 'Contestações',
                        data: chartData[7].contestacoes,
                        backgroundColor: '#5e6278',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: chartData[7].max,
                        ticks: {
                            stepSize: 10
                        },
                        grid: {
                            color: '#f5f8fa'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        createLegend();
        
        if (periodFilter) {
            periodFilter.addEventListener('change', function() {
                const selectedPeriod = parseInt(this.value);
                updateChart(selectedPeriod);
                createLegend();
            });
        }
    }
});
