document.addEventListener('DOMContentLoaded', function () {
    // Variáveis globais para os gráficos
    let fonteGeracaoChart, campanhaChart, tendenciaChart;

    // Gráfico de Comparativo entre Fontes de Geração
    const fonteGeracaoCtx = document.getElementById('fonteGeracaoChart');
    if (fonteGeracaoCtx) {
        fonteGeracaoChart = new Chart(fonteGeracaoCtx, {
            type: 'bar',
            data: {
                labels: ['Meta Ads', 'Google Ads', 'Landing Page', 'E-mail', 'Afiliados'],
                datasets: [
                    {
                        label: 'Volume',
                        data: [520, 380, 240, 80, 20],
                        backgroundColor: '#ff007a',
                        borderRadius: 4
                    },
                    {
                        label: 'Taxa de Contestação (%)',
                        data: [4.2, 3.8, 5.1, 6.2, 8.5],
                        backgroundColor: '#bd2735',
                        borderRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Volume de Leads'
                        }
                    },
                    y1: {
                        beginAtZero: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Taxa de Contestação (%)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    // Gráfico de Desempenho por Campanha
    const campanhaCtx = document.getElementById('campanhaChart');
    if (campanhaCtx) {
        campanhaChart = new Chart(campanhaCtx, {
            type: 'doughnut',
            data: {
                labels: ['Campanha A', 'Campanha B', 'Campanha C', 'Campanha D'],
                datasets: [{
                    data: [420, 310, 280, 230],
                    backgroundColor: [
                        '#ff007a',
                        '#009ef7',
                        '#7239ea',
                        '#f59e0b'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} leads (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de Tendências e Sazonalidade
    const tendenciaCtx = document.getElementById('tendenciaChart');
    const tendenciaPeriodFilter = document.getElementById('tendenciaPeriodFilter');

    const tendenciaData = {
        dia: {
            labels: ['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h'],
            leads: [2, 1, 0, 3, 12, 28, 35, 42, 38, 25, 15, 8]
        },
        semana: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            leads: [180, 195, 165, 210, 225, 140, 95]
        },
        mes: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            leads: [1240, 1180, 1320, 1280]
        }
    };

    function updateTendenciaChart(period) {
        const data = tendenciaData[period];
        if (tendenciaChart) {
            tendenciaChart.data.labels = data.labels;
            tendenciaChart.data.datasets[0].data = data.leads;
            tendenciaChart.update();
        }
    }

    if (tendenciaCtx) {
        tendenciaChart = new Chart(tendenciaCtx, {
            type: 'line',
            data: {
                labels: tendenciaData.dia.labels,
                datasets: [{
                    label: 'Leads Gerados',
                    data: tendenciaData.dia.leads,
                    borderColor: '#ff007a',
                    backgroundColor: 'rgba(255, 0, 122, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        if (tendenciaPeriodFilter) {
            tendenciaPeriodFilter.addEventListener('change', function() {
                updateTendenciaChart(this.value);
            });
        }
    }

    // Toggle Filtros
    const toggleFiltrosBtn = document.getElementById('toggleFiltrosBtn');
    const filtrosCard = document.getElementById('filtrosCard');
    
    if (toggleFiltrosBtn && filtrosCard) {
        toggleFiltrosBtn.addEventListener('click', function() {
            if (filtrosCard.style.display === 'none') {
                filtrosCard.style.display = 'block';
                toggleFiltrosBtn.classList.add('active');
            } else {
                filtrosCard.style.display = 'none';
                toggleFiltrosBtn.classList.remove('active');
            }
        });
    }

    // Filtros de Dados
    const resetFiltersBtn = document.getElementById('resetFilters');
    const filterInputs = {
        regiao: document.getElementById('filterRegiao'),
        tipoLead: document.getElementById('filterTipoLead'),
        fonte: document.getElementById('filterFonte'),
        operadora: document.getElementById('filterOperadora'),
        campanha: document.getElementById('filterCampanha'),
        modeloVenda: document.getElementById('filterModeloVenda'),
        dataInicio: document.getElementById('filterDataInicio'),
        dataFim: document.getElementById('filterDataFim')
    };

    // Dados simulados para demonstração
    const dadosSimulados = {
        total: {
            leadsIntegrados: 1240,
            leadsVendidos: 1147,
            leadsValidos: 1147,
            leadsInvalidos: 93,
            leadsContestados: 52,
            contestacoesAceitas: 20,
            precoMedio: 16.05,
            receitaTotal: 18400,
            receitaAReceber: 4200
        },
        porRegiao: {
            SP: { leadsIntegrados: 520, leadsVendidos: 485, leadsValidos: 485, leadsInvalidos: 35, leadsContestados: 18, contestacoesAceitas: 7, precoMedio: 17.50, receitaTotal: 8487.50, receitaAReceber: 1800 },
            RJ: { leadsIntegrados: 380, leadsVendidos: 360, leadsValidos: 360, leadsInvalidos: 20, leadsContestados: 12, contestacoesAceitas: 5, precoMedio: 16.80, receitaTotal: 6048, receitaAReceber: 1400 },
            MG: { leadsIntegrados: 340, leadsVendidos: 302, leadsValidos: 302, leadsInvalidos: 38, leadsContestados: 22, contestacoesAceitas: 8, precoMedio: 15.20, receitaTotal: 4590.40, receitaAReceber: 1000 }
        },
        porTipoLead: {
            PF: { leadsIntegrados: 800, leadsVendidos: 750, leadsValidos: 750, leadsInvalidos: 50, leadsContestados: 30, contestacoesAceitas: 12, precoMedio: 14.50, receitaTotal: 10875, receitaAReceber: 2500 },
            PME: { leadsIntegrados: 300, leadsVendidos: 280, leadsValidos: 280, leadsInvalidos: 20, leadsContestados: 15, contestacoesAceitas: 5, precoMedio: 22.00, receitaTotal: 6160, receitaAReceber: 1200 },
            ADESAO: { leadsIntegrados: 100, leadsVendidos: 90, leadsValidos: 90, leadsInvalidos: 10, leadsContestados: 5, contestacoesAceitas: 2, precoMedio: 18.00, receitaTotal: 1620, receitaAReceber: 400 },
            ODONTO: { leadsIntegrados: 40, leadsVendidos: 27, leadsValidos: 27, leadsInvalidos: 13, leadsContestados: 2, contestacoesAceitas: 1, precoMedio: 20.00, receitaTotal: 540, receitaAReceber: 100 }
        },
        porFonte: {
            META: { leadsIntegrados: 520, leadsVendidos: 485, leadsValidos: 485, leadsInvalidos: 35, leadsContestados: 18, contestacoesAceitas: 7, precoMedio: 16.50, receitaTotal: 8002.50, receitaAReceber: 1800 },
            GOOGLE: { leadsIntegrados: 380, leadsVendidos: 360, leadsValidos: 360, leadsInvalidos: 20, leadsContestados: 12, contestacoesAceitas: 5, precoMedio: 17.00, receitaTotal: 6120, receitaAReceber: 1400 },
            LP: { leadsIntegrados: 240, leadsVendidos: 220, leadsValidos: 220, leadsInvalidos: 20, leadsContestados: 15, contestacoesAceitas: 6, precoMedio: 15.50, receitaTotal: 3410, receitaAReceber: 800 },
            EMAIL: { leadsIntegrados: 80, leadsVendidos: 70, leadsValidos: 70, leadsInvalidos: 10, leadsContestados: 5, contestacoesAceitas: 2, precoMedio: 14.00, receitaTotal: 980, receitaAReceber: 200 },
            AFILIADO: { leadsIntegrados: 20, leadsVendidos: 12, leadsValidos: 12, leadsInvalidos: 8, leadsContestados: 2, contestacoesAceitas: 0, precoMedio: 13.50, receitaTotal: 162, receitaAReceber: 0 }
        }
    };

    // Função para aplicar filtros
    function aplicarFiltros() {
        const filtros = {
            regiao: filterInputs.regiao?.value || '',
            tipoLead: filterInputs.tipoLead?.value || '',
            fonte: filterInputs.fonte?.value || '',
            operadora: filterInputs.operadora?.value || '',
            campanha: filterInputs.campanha?.value || '',
            modeloVenda: filterInputs.modeloVenda?.value || '',
            dataInicio: filterInputs.dataInicio?.value || '',
            dataFim: filterInputs.dataFim?.value || ''
        };

        // Calcular métricas filtradas
        const metricas = calcularMetricas(filtros);
        
        // Atualizar indicadores na tela
        atualizarIndicadores(metricas);
        
        // Atualizar gráficos
        atualizarGraficos(filtros);
    }

    // Função para calcular métricas baseadas nos filtros
    function calcularMetricas(filtros) {
        let dados = dadosSimulados.total;

        // Aplicar filtro de região
        if (filtros.regiao && dadosSimulados.porRegiao[filtros.regiao]) {
            dados = dadosSimulados.porRegiao[filtros.regiao];
        }

        // Aplicar filtro de tipo de lead
        if (filtros.tipoLead && dadosSimulados.porTipoLead[filtros.tipoLead]) {
            const dadosTipo = dadosSimulados.porTipoLead[filtros.tipoLead];
            // Se já filtrou por região, usar média, senão usar dados do tipo
            if (!filtros.regiao) {
                dados = dadosTipo;
            } else {
                // Combinar filtros (exemplo simplificado)
                dados = {
                    leadsIntegrados: Math.min(dados.leadsIntegrados, dadosTipo.leadsIntegrados),
                    leadsVendidos: Math.min(dados.leadsVendidos, dadosTipo.leadsVendidos),
                    leadsValidos: Math.min(dados.leadsValidos, dadosTipo.leadsValidos),
                    leadsInvalidos: Math.max(dados.leadsInvalidos, dadosTipo.leadsInvalidos),
                    leadsContestados: Math.max(dados.leadsContestados, dadosTipo.leadsContestados),
                    contestacoesAceitas: Math.max(dados.contestacoesAceitas, dadosTipo.contestacoesAceitas),
                    precoMedio: (dados.precoMedio + dadosTipo.precoMedio) / 2,
                    receitaTotal: Math.min(dados.receitaTotal, dadosTipo.receitaTotal),
                    receitaAReceber: Math.min(dados.receitaAReceber, dadosTipo.receitaAReceber)
                };
            }
        }

        // Aplicar filtro de fonte
        if (filtros.fonte && dadosSimulados.porFonte[filtros.fonte]) {
            const dadosFonte = dadosSimulados.porFonte[filtros.fonte];
            if (!filtros.regiao && !filtros.tipoLead) {
                dados = dadosFonte;
            }
        }

        // Calcular métricas derivadas
        const taxaContestacao = dados.leadsVendidos > 0 ? (dados.leadsContestados / dados.leadsVendidos * 100).toFixed(1) : 0;
        const taxaInvalidacao = dados.leadsContestados > 0 ? (dados.contestacoesAceitas / dados.leadsContestados * 100).toFixed(1) : 0;
        const percentualVendidos = dados.leadsIntegrados > 0 ? (dados.leadsVendidos / dados.leadsIntegrados * 100).toFixed(1) : 0;

        return {
            leadsIntegrados: dados.leadsIntegrados,
            leadsVendidos: dados.leadsVendidos,
            leadsValidos: dados.leadsValidos,
            leadsInvalidos: dados.leadsInvalidos,
            leadsContestados: dados.leadsContestados,
            taxaContestacao: taxaContestacao,
            taxaInvalidacao: taxaInvalidacao,
            precoMedio: dados.precoMedio.toFixed(2),
            receitaTotal: dados.receitaTotal,
            receitaAReceber: dados.receitaAReceber,
            percentualVendidos: percentualVendidos
        };
    }

    // Função para atualizar indicadores na tela
    function atualizarIndicadores(metricas) {
        // Formatar números
        const formatarNumero = (num) => {
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'k';
            }
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        const formatarMoeda = (valor) => {
            if (valor >= 1000) {
                return 'R$ ' + (valor / 1000).toFixed(1) + 'k';
            }
            return 'R$ ' + valor.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

        // Atualizar cada métrica
        const elLeadsIntegrados = document.getElementById('metricLeadsIntegrados');
        if (elLeadsIntegrados) {
            elLeadsIntegrados.textContent = formatarNumero(metricas.leadsIntegrados);
        }
        const elLeadsIntegradosDetalhe = document.getElementById('metricLeadsIntegradosDetalhe');
        if (elLeadsIntegradosDetalhe) {
            const hoje = Math.floor(metricas.leadsIntegrados * 0.036);
            elLeadsIntegradosDetalhe.textContent = `Hoje: ${hoje} | Mês: ${formatarNumero(metricas.leadsIntegrados)}`;
        }

        const elLeadsVendidos = document.getElementById('metricLeadsVendidos');
        if (elLeadsVendidos) {
            elLeadsVendidos.textContent = formatarNumero(metricas.leadsVendidos);
        }
        const elLeadsVendidosDetalhe = document.getElementById('metricLeadsVendidosDetalhe');
        if (elLeadsVendidosDetalhe) {
            elLeadsVendidosDetalhe.textContent = `${metricas.percentualVendidos}% do total`;
        }

        const elLeadsValidos = document.getElementById('metricLeadsValidos');
        if (elLeadsValidos) {
            elLeadsValidos.textContent = formatarNumero(metricas.leadsValidos);
        }
        const elLeadsValidosDetalhe = document.getElementById('metricLeadsValidosDetalhe');
        if (elLeadsValidosDetalhe) {
            elLeadsValidosDetalhe.textContent = `Inválidos: ${metricas.leadsInvalidos}`;
        }

        const elLeadsContestados = document.getElementById('metricLeadsContestados');
        if (elLeadsContestados) {
            elLeadsContestados.textContent = metricas.leadsContestados;
        }
        const elLeadsContestadosDetalhe = document.getElementById('metricLeadsContestadosDetalhe');
        if (elLeadsContestadosDetalhe) {
            elLeadsContestadosDetalhe.textContent = `${metricas.taxaContestacao}% do total`;
        }

        const elTaxaContestacao = document.getElementById('metricTaxaContestacao');
        if (elTaxaContestacao) {
            elTaxaContestacao.textContent = metricas.taxaContestacao + '%';
        }

        const elTaxaInvalidacao = document.getElementById('metricTaxaInvalidacao');
        if (elTaxaInvalidacao) {
            elTaxaInvalidacao.textContent = metricas.taxaInvalidacao + '%';
        }
        const elTaxaInvalidacaoDetalhe = document.getElementById('metricTaxaInvalidacaoDetalhe');
        if (elTaxaInvalidacaoDetalhe) {
            elTaxaInvalidacaoDetalhe.textContent = `${metricas.leadsContestados > 0 ? Math.round(metricas.leadsContestados * metricas.taxaInvalidacao / 100) : 0} de ${metricas.leadsContestados} contestações`;
        }

        const elPrecoMedio = document.getElementById('metricPrecoMedio');
        if (elPrecoMedio) {
            elPrecoMedio.textContent = 'R$ ' + metricas.precoMedio.replace('.', ',');
        }

        const elReceitaTotal = document.getElementById('metricReceitaTotal');
        if (elReceitaTotal) {
            elReceitaTotal.textContent = formatarMoeda(metricas.receitaTotal);
        }
        const elReceitaTotalDetalhe = document.getElementById('metricReceitaTotalDetalhe');
        if (elReceitaTotalDetalhe) {
            elReceitaTotalDetalhe.textContent = `A receber: ${formatarMoeda(metricas.receitaAReceber)}`;
        }
    }

    // Função para atualizar gráficos
    function atualizarGraficos(filtros) {
        // Atualizar gráfico de Fontes de Geração
        if (fonteGeracaoChart) {
            const dadosFonte = calcularDadosFonte(filtros);
            fonteGeracaoChart.data.datasets[0].data = dadosFonte.volumes;
            fonteGeracaoChart.data.datasets[1].data = dadosFonte.taxasContestacao;
            fonteGeracaoChart.update();
        }

        // Atualizar gráfico de Campanhas
        if (campanhaChart) {
            const dadosCampanha = calcularDadosCampanha(filtros);
            campanhaChart.data.datasets[0].data = dadosCampanha.valores;
            campanhaChart.update();
        }

        // Atualizar gráfico de Tendências
        if (tendenciaChart) {
            const dadosTendencia = calcularDadosTendencia(filtros);
            tendenciaChart.data.datasets[0].data = dadosTendencia.leads;
            tendenciaChart.update();
        }

        // Atualizar Heatmap de Regiões
        atualizarHeatmapRegioes(filtros);

        // Atualizar Saúde da Operação
        atualizarSaudeOperacao(filtros);
    }

    // Função para calcular dados de fontes
    function calcularDadosFonte(filtros) {
        const base = {
            META: { volume: 520, taxa: 4.2 },
            GOOGLE: { volume: 380, taxa: 3.8 },
            LP: { volume: 240, taxa: 5.1 },
            EMAIL: { volume: 80, taxa: 6.2 },
            AFILIADO: { volume: 20, taxa: 8.5 }
        };

        // Aplicar filtros (exemplo simplificado)
        let multiplicador = 1;
        if (filtros.regiao) multiplicador *= 0.8;
        if (filtros.tipoLead) multiplicador *= 0.9;
        if (filtros.dataInicio || filtros.dataFim) multiplicador *= 0.7;

        return {
            volumes: [
                Math.round(base.META.volume * multiplicador),
                Math.round(base.GOOGLE.volume * multiplicador),
                Math.round(base.LP.volume * multiplicador),
                Math.round(base.EMAIL.volume * multiplicador),
                Math.round(base.AFILIADO.volume * multiplicador)
            ],
            taxasContestacao: [
                base.META.taxa,
                base.GOOGLE.taxa,
                base.LP.taxa,
                base.EMAIL.taxa,
                base.AFILIADO.taxa
            ]
        };
    }

    // Função para calcular dados de campanhas
    function calcularDadosCampanha(filtros) {
        const base = [420, 310, 280, 230];
        let multiplicador = 1;
        if (filtros.regiao) multiplicador *= 0.8;
        if (filtros.tipoLead) multiplicador *= 0.9;
        if (filtros.dataInicio || filtros.dataFim) multiplicador *= 0.7;

        return {
            valores: base.map(v => Math.round(v * multiplicador))
        };
    }

    // Função para calcular dados de tendências
    function calcularDadosTendencia(filtros) {
        const base = [2, 1, 0, 3, 12, 28, 35, 42, 38, 25, 15, 8];
        let multiplicador = 1;
        if (filtros.regiao) multiplicador *= 0.8;
        if (filtros.tipoLead) multiplicador *= 0.9;
        if (filtros.dataInicio || filtros.dataFim) multiplicador *= 0.7;

        return {
            leads: base.map(v => Math.round(v * multiplicador))
        };
    }

    // Função para atualizar Heatmap de Regiões
    function atualizarHeatmapRegioes(filtros) {
        const regioes = [
            { nome: 'São Paulo', leadsValidos: 420, contestacoes: 18, percentual: 4.3, operadora: 'Unimed' },
            { nome: 'Rio de Janeiro', leadsValidos: 285, contestacoes: 8, percentual: 2.8, operadora: 'Amil' },
            { nome: 'Minas Gerais', leadsValidos: 198, contestacoes: 12, percentual: 6.1, operadora: 'Hapvida' }
        ];

        let multiplicador = 1;
        if (filtros.tipoLead) multiplicador *= 0.9;
        if (filtros.fonte) multiplicador *= 0.85;
        if (filtros.dataInicio || filtros.dataFim) multiplicador *= 0.7;
        if (filtros.regiao) {
            // Se filtrar por região específica, mostrar apenas essa região ou ajustar valores
            if (filtros.regiao === 'SP') multiplicador = 1.0;
            else if (filtros.regiao === 'RJ') multiplicador = 0.68;
            else if (filtros.regiao === 'MG') multiplicador = 0.47;
        }

        const heatmapContainer = document.getElementById('heatmapRegioes');
        if (!heatmapContainer) return;

        const items = heatmapContainer.querySelectorAll('.heatmap-item');
        items.forEach((item, index) => {
            if (index < regioes.length) {
                const regiao = regioes[index];
                const novoLeadsValidos = Math.round(regiao.leadsValidos * multiplicador);
                const novasContestacoes = Math.round(regiao.contestacoes * multiplicador);
                const novoPercentual = novoLeadsValidos > 0 ? ((novasContestacoes / novoLeadsValidos) * 100).toFixed(1) : 0;

                const divs = item.querySelectorAll('.text-gray-800');
                if (divs.length >= 3) {
                    divs[0].innerHTML = `<i class="ki-duotone ki-check-circle fs-6 text-gray-800 me-2"><span class="path1"></span><span class="path2"></span></i>Leads Válidos: ${novoLeadsValidos}`;
                    divs[1].innerHTML = `<i class="ki-duotone ki-abstract-11 fs-6 text-gray-800 me-2"><span class="path1"></span><span class="path2"></span></i>Contestações: ${novasContestacoes} (${novoPercentual}%)`;
                    divs[2].innerHTML = `<i class="ki-duotone ki-verify fs-6 text-gray-800 me-2"><span class="path1"></span><span class="path2"></span></i>Operadora Preferida: ${regiao.operadora}`;
                }
            }
        });
    }

    // Função para atualizar Saúde da Operação
    function atualizarSaudeOperacao(filtros) {
        // Calcular score baseado nos filtros
        let score = 8.4;
        let incidentes = 3;

        if (filtros.regiao === 'SP') {
            score = 8.6;
            incidentes = 2;
        } else if (filtros.regiao === 'RJ') {
            score = 8.8;
            incidentes = 1;
        } else if (filtros.regiao === 'MG') {
            score = 7.9;
            incidentes = 4;
        }

        if (filtros.tipoLead === 'PF') {
            score += 0.2;
        } else if (filtros.tipoLead === 'PME') {
            score -= 0.1;
        }

        const scoreEl = document.querySelector('.score-value');
        if (scoreEl) {
            scoreEl.textContent = Math.round(score * 10) + '%';
        }

        const scoreTextEl = document.querySelector('.bg-light-primary .fw-bold.fs-2x');
        if (scoreTextEl) {
            scoreTextEl.textContent = score.toFixed(1) + '/10';
        }

        const incidentesEl = document.querySelector('.bg-light-warning .fw-bold.fs-2x');
        if (incidentesEl) {
            incidentesEl.textContent = incidentes + ' incidentes';
        }
    }

    // Reset de filtros
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            if (filterInputs.regiao) filterInputs.regiao.value = '';
            if (filterInputs.tipoLead) filterInputs.tipoLead.value = '';
            if (filterInputs.fonte) filterInputs.fonte.value = '';
            if (filterInputs.operadora) filterInputs.operadora.value = '';
            if (filterInputs.campanha) filterInputs.campanha.value = '';
            if (filterInputs.modeloVenda) filterInputs.modeloVenda.value = '';
            if (filterInputs.dataInicio) filterInputs.dataInicio.value = '';
            if (filterInputs.dataFim) filterInputs.dataFim.value = '';
            
            aplicarFiltros();
        });
    }

    // Adicionar event listeners para os filtros
    Object.values(filterInputs).forEach(input => {
        if (input) {
            if (input.tagName === 'SELECT' || input.type === 'date' || input.type === 'text') {
                input.addEventListener('change', function() {
                    aplicarFiltros();
                });
            }
            if (input.type === 'text') {
                // Para campos de texto, usar debounce para não fazer muitas requisições
                let timeout;
                input.addEventListener('input', function() {
                    clearTimeout(timeout);
                    timeout = setTimeout(function() {
                        aplicarFiltros();
                    }, 500);
                });
            }
        }
    });

    // Score Circle Animation
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        const scoreValue = scoreCircle.querySelector('.score-value');
        const score = 84;
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (score / 100) * circumference;
        
        scoreCircle.innerHTML = `
            <svg width="100" height="100" class="score-svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e4e6ef" stroke-width="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#009ef7" stroke-width="8" 
                        stroke-dasharray="${circumference}" 
                        stroke-dashoffset="${offset}"
                        stroke-linecap="round"
                        transform="rotate(-90 50 50)"/>
            </svg>
            <div class="score-value">${score}%</div>
        `;
    }
});
