document.addEventListener('DOMContentLoaded', function () {
    var abrirDistribuirButtons = document.querySelectorAll('.js-open-distribuir');
    var modalCarregado = false;
    var modalElemento = null;

    function fecharModal() {
        if (!modalElemento) return;
        modalElemento.style.display = 'none';
        document.body.classList.remove('modal-open-custom');
    }

    function registrarEventosFechamento() {
        if (!modalElemento) return;

        modalElemento.querySelectorAll('[data-distribuir-close]').forEach(function (btn) {
            btn.addEventListener('click', fecharModal);
        });

        modalElemento.addEventListener('click', function (event) {
            if (event.target === modalElemento) {
                fecharModal();
            }
        });
    }

    function abrirModal() {
        if (!modalElemento) return;
        modalElemento.style.display = 'flex';
        document.body.classList.add('modal-open-custom');
    }

    function carregarModal(callback) {
        if (modalCarregado) {
            callback();
            return;
        }

        fetch('modals/distribuir-selecionados.html')
            .then(function (response) { return response.text(); })
            .then(function (html) {
                var container = document.createElement('div');
                container.innerHTML = html;
                document.body.appendChild(container.firstElementChild);

                modalElemento = document.getElementById('modal_distribuir_selecionados');
                modalCarregado = true;

                registrarEventosFechamento();
                callback();
            })
            .catch(function (error) {
                console.error('Erro ao carregar modal de distribuição:', error);
            });
    }

    abrirDistribuirButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            event.preventDefault();
            carregarModal(abrirModal);
        });
    });

    var inputBuscaPrincipal = document.getElementById('filtroBuscaPrincipal');
    var btnBuscarPrincipal = document.getElementById('btnBuscarPrincipal');
    var tabela = document.getElementById('tabelaEstoqueLeads');
    var linhasTabela = tabela ? Array.from(tabela.querySelectorAll('tbody tr')) : [];

    var btnsTipo = document.querySelectorAll('.js-filtro-tipo');
    var btnsTemperatura = document.querySelectorAll('.js-filtro-temp');
    var selectOperadora = document.getElementById('filtroOperadora');
    var selectFonte = document.getElementById('filtroFonte');
    var selectIntegrador = document.getElementById('filtroIntegrador');
    var chkContestacao = document.getElementById('filtroContestacaoProibida');
    var btnLimparFiltros = document.getElementById('btnLimparFiltros');
    var inputDataInicio = document.getElementById('filtroDataInicio');
    var inputDataFim = document.getElementById('filtroDataFim');

    var mensagemSemResultados = document.getElementById('mensagemSemResultados');
    var paginacaoContainer = document.getElementById('paginacaoEstoque');
    var paginacaoInfo = document.getElementById('paginacaoInfo');
    var btnPaginaAnterior = document.getElementById('btnPaginaAnterior');
    var btnPaginaProxima = document.getElementById('btnPaginaProxima');
    var tamanhoPagina = 25;
    var paginaAtual = 1;

    var checkTodosLeads = tabela ? document.getElementById('checkTodosLeads') : null;
    var checkboxesLinhas = tabela ? Array.from(tabela.querySelectorAll('tbody .js-check-lead')) : [];
    var barraSelecaoLotes = document.getElementById('barraSelecaoLotes');
    var barraSelecaoQuantidade = document.getElementById('barraSelecaoQuantidade');
    var barraSelecaoFechar = document.getElementById('barraSelecaoFechar');

    function obterTipoSelecionado() {
        var ativo = document.querySelector('.js-filtro-tipo.btn-primary');
        return ativo ? ativo.getAttribute('data-tipo') : '';
    }

    function obterTemperaturaSelecionada() {
        var ativo = document.querySelector('.js-filtro-temp.btn-primary');
        return ativo ? ativo.getAttribute('data-temperatura') : '';
    }

    function atualizarVisibilidadeLimpar() {
        if (!btnLimparFiltros) return;

        var texto = (inputBuscaPrincipal && inputBuscaPrincipal.value || '').trim();
        var tipo = obterTipoSelecionado();
        var temperatura = obterTemperaturaSelecionada();
        var operadora = selectOperadora ? selectOperadora.value : '';
        var fonte = selectFonte ? selectFonte.value : '';
        var integrador = selectIntegrador ? selectIntegrador.value : '';
        var contestacaoProibida = chkContestacao ? chkContestacao.checked : false;
        var dataInicioAtiva = inputDataInicio && inputDataInicio.value;
        var dataFimAtiva = inputDataFim && inputDataFim.value;

        var ativo = !!(texto || tipo || temperatura || operadora || fonte || integrador || contestacaoProibida || dataInicioAtiva || dataFimAtiva);
        btnLimparFiltros.classList.toggle('d-none', !ativo);
    }

    function atualizarMensagemSemResultados(total) {
        if (!mensagemSemResultados) return;
        mensagemSemResultados.classList.toggle('d-none', total > 0);
    }

    function aplicarPaginacao(filtradas) {
        if (!tabela) return;

        // Garante que linhas não filtradas permaneçam escondidas
        linhasTabela.forEach(function (linha) {
            if (linha.dataset.match !== '1') {
                linha.classList.add('d-none');
            }
        });

        if (!filtradas || filtradas.length === 0) {
            if (paginacaoContainer) paginacaoContainer.classList.add('d-none');
            return;
        }

        if (filtradas.length <= tamanhoPagina) {
            filtradas.forEach(function (linha) {
                linha.classList.remove('d-none');
            });
            if (paginacaoContainer) paginacaoContainer.classList.add('d-none');
            return;
        }

        var totalPaginas = Math.ceil(filtradas.length / tamanhoPagina);
        if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;

        var inicio = (paginaAtual - 1) * tamanhoPagina;
        var fim = inicio + tamanhoPagina;

        filtradas.forEach(function (linha, index) {
            var dentro = index >= inicio && index < fim;
            linha.classList.toggle('d-none', !dentro);
        });

        if (paginacaoContainer) paginacaoContainer.classList.remove('d-none');
        if (paginacaoInfo) paginacaoInfo.textContent = 'Página ' + paginaAtual + ' de ' + totalPaginas;
        if (btnPaginaAnterior) btnPaginaAnterior.disabled = paginaAtual === 1;
        if (btnPaginaProxima) btnPaginaProxima.disabled = paginaAtual === totalPaginas;
    }

    function aplicarFiltros() {
        var texto = (inputBuscaPrincipal && inputBuscaPrincipal.value || '').toLowerCase().trim();
        var tipo = obterTipoSelecionado();
        var temperatura = obterTemperaturaSelecionada();
        var operadora = selectOperadora ? selectOperadora.value : '';
        var fonte = selectFonte ? selectFonte.value : '';
        var integrador = selectIntegrador ? selectIntegrador.value : '';
        var contestacaoProibida = chkContestacao ? chkContestacao.checked : false;
        var dataInicio = inputDataInicio && inputDataInicio.value ? new Date(inputDataInicio.value) : null;
        var dataFim = inputDataFim && inputDataFim.value ? new Date(inputDataFim.value) : null;

        var filtradas = [];

        linhasTabela.forEach(function (linha) {
            var visivel = true;
            var dataset = linha.dataset;

            if (texto) {
                var textoLinha = linha.textContent.toLowerCase();
                if (textoLinha.indexOf(texto) === -1) {
                    visivel = false;
                }
            }

            if (visivel && tipo && dataset.tipo !== tipo) {
                visivel = false;
            }

            if (visivel && temperatura && dataset.temperatura !== temperatura) {
                visivel = false;
            }

            if (visivel && operadora && dataset.operadora !== operadora) {
                visivel = false;
            }

            if (visivel && fonte && dataset.origem !== fonte) {
                visivel = false;
            }

            if (visivel && integrador && dataset.integrador !== integrador) {
                visivel = false;
            }

            if (visivel && contestacaoProibida && dataset.motivo === 'duplicado') {
                visivel = false;
            }

            if (visivel && (dataInicio || dataFim)) {
                var dataLeadStr = dataset.data;
                if (!dataLeadStr) {
                    visivel = false;
                } else {
                    var dataLead = new Date(dataLeadStr);
                    if (dataInicio && dataLead < dataInicio) {
                        visivel = false;
                    }
                    if (dataFim && dataLead > dataFim) {
                        visivel = false;
                    }
                }
            }

            linha.dataset.match = visivel ? '1' : '0';

            if (!visivel) {
                linha.classList.add('d-none');
            } else {
                filtradas.push(linha);
            }
        });

        atualizarMensagemSemResultados(filtradas.length);
        atualizarVisibilidadeLimpar();
        aplicarPaginacao(filtradas);
    }

    function atualizarBarraSelecao() {
        if (!barraSelecaoLotes || !barraSelecaoQuantidade) return;
        var selecionados = checkboxesLinhas.filter(function (cb) { return cb.checked && !cb.closest('tr').classList.contains('d-none'); }).length;
        barraSelecaoQuantidade.textContent = selecionados;
        barraSelecaoLotes.classList.toggle('d-none', selecionados === 0);
    }

    if (btnBuscarPrincipal && inputBuscaPrincipal) {
        btnBuscarPrincipal.addEventListener('click', function () {
            paginaAtual = 1;
            aplicarFiltros();
        });

        inputBuscaPrincipal.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                paginaAtual = 1;
                aplicarFiltros();
            }
        });
    }

    btnsTipo.forEach(function (btn) {
        btn.addEventListener('click', function () {
            btnsTipo.forEach(function (b) {
                b.classList.remove('btn-primary');
                b.classList.add('btn-light');
            });
            btn.classList.remove('btn-light');
            btn.classList.add('btn-primary');
            paginaAtual = 1;
            aplicarFiltros();
        });
    });

    btnsTemperatura.forEach(function (btn) {
        btn.addEventListener('click', function () {
            btnsTemperatura.forEach(function (b) {
                b.classList.remove('btn-primary');
                b.classList.add('btn-light');
            });
            btn.classList.remove('btn-light');
            btn.classList.add('btn-primary');
            paginaAtual = 1;
            aplicarFiltros();
        });
    });

    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener('click', function () {
            if (inputBuscaPrincipal) inputBuscaPrincipal.value = '';
            if (selectOperadora) selectOperadora.value = '';
            if (selectFonte) selectFonte.value = '';
            if (selectIntegrador) selectIntegrador.value = '';
            if (chkContestacao) chkContestacao.checked = false;
            if (inputDataInicio) inputDataInicio.value = '';
            if (inputDataFim) inputDataFim.value = '';

            btnsTipo.forEach(function (b) {
                b.classList.remove('btn-primary');
                b.classList.add('btn-light');
            });

            btnsTemperatura.forEach(function (b) {
                b.classList.remove('btn-primary');
                b.classList.add('btn-light');
            });

            paginaAtual = 1;
            aplicarFiltros();
            atualizarVisibilidadeLimpar();
        });
    }

    if (selectOperadora) {
        selectOperadora.addEventListener('change', function () {
            paginaAtual = 1;
            aplicarFiltros();
        });
    }

    if (selectFonte) {
        selectFonte.addEventListener('change', function () {
            paginaAtual = 1;
            aplicarFiltros();
        });
    }

    if (selectIntegrador) {
        selectIntegrador.addEventListener('change', function () {
            paginaAtual = 1;
            aplicarFiltros();
        });
    }

    if (chkContestacao) {
        chkContestacao.addEventListener('change', function () {
            paginaAtual = 1;
            aplicarFiltros();
        });
    }

    if (inputDataInicio) {
        inputDataInicio.addEventListener('change', function () {
            paginaAtual = 1;
            aplicarFiltros();
        });
    }

    if (inputDataFim) {
        inputDataFim.addEventListener('change', function () {
            paginaAtual = 1;
            aplicarFiltros();
        });
    }

    if (btnPaginaAnterior) {
        btnPaginaAnterior.addEventListener('click', function () {
            if (paginaAtual > 1) {
                paginaAtual -= 1;
                aplicarFiltros();
            }
        });
    }

    if (btnPaginaProxima) {
        btnPaginaProxima.addEventListener('click', function () {
            paginaAtual += 1;
            aplicarFiltros();
        });
    }

    if (checkTodosLeads && checkboxesLinhas.length) {
        checkTodosLeads.addEventListener('change', function () {
            var marcado = checkTodosLeads.checked;
            checkboxesLinhas.forEach(function (cb) {
                cb.checked = marcado;
            });
            atualizarBarraSelecao();
        });

        checkboxesLinhas.forEach(function (cb) {
            cb.addEventListener('change', function () {
                var todosMarcados = checkboxesLinhas.every(function (c) { return c.checked; });
                checkTodosLeads.checked = todosMarcados;
                atualizarBarraSelecao();
            });
        });
    }

    if (barraSelecaoFechar && barraSelecaoLotes && checkboxesLinhas.length) {
        barraSelecaoFechar.addEventListener('click', function () {
            barraSelecaoLotes.classList.add('d-none');
            checkTodosLeads.checked = false;
            checkboxesLinhas.forEach(function (cb) {
                cb.checked = false;
            });
        });
    }

    aplicarFiltros();
});