const monthsOrder = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

Chart.register(ChartDataLabels);

const graphConfigs = {
    perdas: {
        title: "MONITORAR OS TIPOS DE PERDAS NA PRODUÇÃO",
        render: (ctx, data) => {
            const datasets = [];
            const colors = ['#007bff', '#dc3545', '#ffc107', '#28a745', '#17a2b8', '#6c757d', '#343a40'];
            let i = 0;

            for (const item of data) {
                if (!item.description || !item.values) continue;
                datasets.push({
                    label: item.description,
                    data: monthsOrder.map(m => item.values[m] || 0),
                    backgroundColor: colors[i % colors.length],
                    borderWidth: 1
                });
                i++;
            }

            return new Chart(ctx, {
                type: 'bar',
                data: { labels: monthsOrder, datasets: datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { stacked: true },
                        y: { stacked: true, beginAtZero: true }
                    },
                    plugins: {
                        datalabels: {
                            color: '#fff',
                            font: { size: 10 },
                            formatter: (value) => (value > 0 ? value : '')
                        },
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    },
    pcp: {
        title: "ENTREGAR A PRODUÇÃO NO PRAZO PLANEJADO",
        render: (ctx, data) => {
            const getValues = (desc) => (data.find(d => d.description === desc) || {}).values || {};
            const opNoPrazo = getValues('% OP no Prazo');
            const ofNoPrazo = getValues('% OF no Prazo');

            const datasets = [
                {
                    type: 'bar',
                    label: '% OP no Prazo',
                    data: monthsOrder.map(m => (opNoPrazo[m] || 0) * 100),
                    backgroundColor: '#1E3A8A',
                    yAxisID: 'y',
                    datalabels: {
                        align: 'end',
                        anchor: 'end'
                    }
                },
                {
                    type: 'bar',
                    label: '% OF no Prazo',
                    data: monthsOrder.map(m => (ofNoPrazo[m] || 0) * 100),
                    backgroundColor: '#EAB308',
                    yAxisID: 'y',
                    datalabels: {
                        align: 'start',
                        anchor: 'end'
                    }
                },
                {
                    type: 'line',
                    label: 'META (> 90%)',
                    data: monthsOrder.map(() => 90),
                    borderColor: 'red',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0,
                    yAxisID: 'y'
                }
            ];

            return new Chart(ctx, {
                data: { labels: monthsOrder, datasets: datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            min: 0,
                            max: 120,
                            ticks: { callback: v => v + '%' }
                        }
                    },
                    plugins: {
                        datalabels: {
                            color: '#000',
                            font: { size: 10 },
                            formatter: (value, context) => {
                                if (context.dataset.type === 'line') return '';
                                return value > 0 ? value.toFixed(1) + '%' : '';
                            }
                        },
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    },
    qualidade: {
        title: "PRODUTO REPROCESSADO + REFUGO < 2% TOTAL",
        render: (ctx, data) => {
            const getValues = (desc) => (data.find(d => d.description === desc) || {}).values || {};
            const percent = getValues('% REPROCESSO + REFUGO');
            const meta = 2; // Updated to 2% as requested

            const datasets = [
                {
                    type: 'bar',
                    label: '% Reprocesso + Refugo',
                    data: monthsOrder.map(m => (percent[m] || 0) * 100),
                    backgroundColor: '#1E3A8A'
                },
                {
                    type: 'line',
                    label: 'META (<= 2%)',
                    data: monthsOrder.map(() => meta),
                    borderColor: 'red',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ];

            return new Chart(ctx, {
                data: { labels: monthsOrder, datasets: datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            min: 0,
                            ticks: { callback: v => v + '%' }
                        }
                    },
                    plugins: {
                        datalabels: {
                            align: 'top',
                            anchor: 'end',
                            color: '#000',
                            font: { size: 10 },
                            formatter: (value, context) => {
                                if (context.dataset.type === 'line') return '';
                                return value > 0 ? value.toFixed(2) + '%' : '';
                            }
                        },
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    },
    manutencao: {
        title: "CUMPRIR O PLANO DE MANUTENÇÃO",
        render: (ctx, data) => {
            const getValues = (desc) => (data.find(d => d.description === desc) || {}).values || {};
            const programadas = getValues('PROGRAMADAS');
            const realizadas = getValues('REALIZADAS');
            const percent = getValues('% MANUTENÇÃO REALIZADA');

            const datasets = [
                {
                    type: 'bar',
                    label: 'Manutenções Programadas',
                    data: monthsOrder.map(m => programadas[m] || 0),
                    backgroundColor: '#dc3545',
                    yAxisID: 'y',
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                        color: '#dc3545'
                    }
                },
                {
                    type: 'bar',
                    label: 'Manutenções Realizadas',
                    data: monthsOrder.map(m => realizadas[m] || 0),
                    backgroundColor: '#007bff',
                    yAxisID: 'y',
                    datalabels: {
                        align: 'start',
                        anchor: 'end',
                        color: '#007bff'
                    }
                },
                {
                    type: 'line',
                    label: '% Realizado',
                    data: monthsOrder.map(m => (percent[m] || 0) * 100),
                    borderColor: 'green',
                    borderWidth: 2,
                    yAxisID: 'y1',
                    datalabels: {
                        align: 'top',
                        anchor: 'center',
                        color: 'green'
                    }
                },
                {
                    type: 'line',
                    label: 'Meta',
                    data: monthsOrder.map(() => 90),
                    borderColor: 'red',
                    borderDash: [5,5],
                    pointRadius: 0,
                    yAxisID: 'y1'
                }
            ];

            return new Chart(ctx, {
                data: { labels: monthsOrder, datasets: datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            beginAtZero: true
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            min: 0,
                            max: 120,
                            grid: { drawOnChartArea: false },
                            ticks: { callback: v => v + '%' }
                        }
                    },
                    plugins: {
                        datalabels: {
                            font: { size: 10, weight: 'bold' },
                            formatter: (value, ctx) => {
                                if (ctx.dataset.label === 'Meta') return '';
                                if (ctx.dataset.label === '% Realizado') return value.toFixed(1) + '%';
                                return value > 0 ? value : '';
                            }
                        },
                        legend: { position: 'bottom' }
                    }
                }
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    fetch('api.php?action=get_graphs')
        .then(res => res.json())
        .then(response => {
            const grid = document.getElementById('dashboard-grid');
            if (response.success && Object.keys(response.graphs).length > 0) {

                ['perdas', 'pcp', 'qualidade', 'manutencao'].forEach(type => {
                    if (response.graphs[type]) {
                        const graphData = response.graphs[type];
                        const config = graphConfigs[type];

                        const card = document.createElement('div');
                        card.className = 'card';

                        card.innerHTML = `
                            <h2>${config.title}</h2>
                            <div class="chart-container" style="position: relative; height:300px; width:100%">
                                <canvas id="chart-${type}"></canvas>
                            </div>
                        `;
                        grid.appendChild(card);

                        const ctx = document.getElementById(`chart-${type}`).getContext('2d');
                        config.render(ctx, graphData.data);
                    }
                });
            } else {
                grid.innerHTML = '<div class="no-data">Nenhum gráfico configurado. Acesse o painel administrativo para fazer o upload dos arquivos.</div>';
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('dashboard-grid').innerHTML = '<div class="no-data text-danger">Erro ao carregar dados.</div>';
        });
});
