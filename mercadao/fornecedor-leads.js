document.addEventListener('DOMContentLoaded', function () {
    var urlParams = new URLSearchParams(window.location.search);
    fornecedorAtual = urlParams.get('fornecedor') || 'sulamerica';

    var fornecedores = {
        'sulamerica': { nome: 'LeadSource Pro', logo: '../assets/images/operatorslogos/sulamerica.png', premium: false },
        'amil': { nome: 'HealthConnect Solutions', logo: '../assets/images/operatorslogos/amil.png', premium: false },
        'bradesco': { nome: 'MedLeads Corporate', logo: '../assets/images/operatorslogos/bradescosaude.png', premium: true },
        'unimed': { nome: 'Wellness Partners', logo: '', premium: false },
        'havida': { nome: 'CareLink Network', logo: '../assets/images/operatorslogos/hapvida.png', premium: false },
        'portosaude': { nome: 'PrimeHealth Leads', logo: '../assets/images/operatorslogos/portosaude.png', premium: true }
    };

    var fornecedorInfo = fornecedores[fornecedorAtual] || fornecedores['sulamerica'];
    var tituloFornecedor = document.getElementById('tituloFornecedor');
    if (tituloFornecedor) {
        var nomeExibido = fornecedorInfo.nome;
        if (!fornecedorInfo.premium) {
            tituloFornecedor.innerHTML = 'Leads: <span class="nome-fornecedor-blur">' + nomeExibido + '</span>';
        } else {
            tituloFornecedor.textContent = 'Leads: ' + nomeExibido;
        }
    }

    var inputBuscaLead = document.getElementById('filtroBuscaLead');
    var btnBuscarLead = document.getElementById('btnBuscarLead');
    var containerLeads = document.getElementById('containerLeads');
    var cardsLeads = containerLeads ? Array.from(containerLeads.querySelectorAll('.lead-card')) : [];
    var mensagemSemResultados = document.getElementById('mensagemSemResultados');

    var btnsTemperatura = document.querySelectorAll('.js-filtro-temp');
    var btnsRegra = document.querySelectorAll('.js-filtro-regra');
    var selectTipoLead = document.getElementById('filtroTipoLead');
    var inputPrecoMin = document.getElementById('filtroPrecoMin');
    var inputPrecoMax = document.getElementById('filtroPrecoMax');
    var selectOrdenarPor = document.getElementById('filtroOrdenarPor');
    var btnLimparFiltros = document.getElementById('btnLimparFiltros');
    var btnAplicarFiltros = document.getElementById('btnAplicarFiltros');

    var carrinhoSidebar = document.getElementById('carrinhoSidebar');
    var carrinhoOverlay = document.getElementById('carrinhoOverlay');
    var btnFecharCarrinho = document.getElementById('btnFecharCarrinho');
    var carrinhoBody = document.getElementById('carrinhoBody');
    var carrinhoTotal = document.getElementById('carrinhoTotal');
    var btnFinalizarCompra = document.getElementById('btnFinalizarCompra');
    var badgeCarrinho = document.getElementById('badgeCarrinho');

    var carrinho = JSON.parse(localStorage.getItem('mercadaoCarrinho') || '[]');

    function atualizarBadgeCarrinho() {
        if (badgeCarrinho) {
            var quantidade = carrinho.length;
            badgeCarrinho.textContent = quantidade;
            if (quantidade === 0) {
                badgeCarrinho.style.display = 'none';
            } else {
                badgeCarrinho.style.display = 'flex';
            }
        }
    }

    function abrirCarrinho() {
        if (carrinhoSidebar) carrinhoSidebar.classList.add('active');
        if (carrinhoOverlay) carrinhoOverlay.classList.add('active');
        atualizarCarrinho();
    }

    function fecharCarrinho() {
        if (carrinhoSidebar) carrinhoSidebar.classList.remove('active');
        if (carrinhoOverlay) carrinhoOverlay.classList.remove('active');
    }

    function atualizarCarrinho() {
        if (!carrinhoBody || !carrinhoTotal) return;

        if (carrinho.length === 0) {
            carrinhoBody.innerHTML = '<div class="text-center text-muted py-10"><i class="ki-duotone ki-cart fs-5x mb-4 text-gray-300"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i><p class="text-gray-500">Seu carrinho está vazio</p></div>';
            carrinhoTotal.textContent = 'C$ 0,00';
            return;
        }

        var html = '';
        var total = 0;

        carrinho.forEach(function (item, index) {
            total += parseFloat(item.preco) || 0;
            html += '<div class="carrinho-item mb-4 pb-4 border-bottom">';
            html += '<div class="d-flex justify-content-between align-items-start mb-2">';
            html += '<div>';
            html += '<div class="fw-bold text-gray-900">' + item.fornecedor + '</div>';
            html += '<div class="text-muted fs-7">' + item.cidade + '</div>';
            html += '</div>';
            html += '<div class="text-end">';
            html += '<div class="fw-bold fs-5" style="color: #ff007a;">R$ ' + parseFloat(item.preco).toFixed(2).replace('.', ',') + '</div>';
            html += '<button type="button" class="btn btn-sm btn-link text-danger p-0 mt-1 btn-remover-item" data-index="' + index + '">Excluir</button>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });

        carrinhoBody.innerHTML = html;
        carrinhoTotal.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');

        document.querySelectorAll('.btn-remover-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var index = parseInt(btn.getAttribute('data-index'));
                carrinho.splice(index, 1);
                localStorage.setItem('mercadaoCarrinho', JSON.stringify(carrinho));
                atualizarBadgeCarrinho();
                atualizarCarrinho();
            });
        });
    }

    if (btnFecharCarrinho) {
        btnFecharCarrinho.addEventListener('click', fecharCarrinho);
    }

    if (carrinhoOverlay) {
        carrinhoOverlay.addEventListener('click', fecharCarrinho);
    }

    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', function () {
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio');
                return;
            }
            alert('Compra finalizada com sucesso!');
            carrinho = [];
            localStorage.setItem('mercadaoCarrinho', JSON.stringify(carrinho));
            atualizarBadgeCarrinho();
            atualizarCarrinho();
            fecharCarrinho();
        });
    }

    var boxMultiplosLeads = document.getElementById('boxMultiplosLeads');
    var contadorLeadsSelecionados = document.getElementById('contadorLeadsSelecionados');
    var btnLimparSelecao = document.getElementById('btnLimparSelecao');
    var btnAdicionarTodosCarrinho = document.getElementById('btnAdicionarTodosCarrinho');

    function atualizarIconeBotao(btn, isActive) {
        var icon = btn.querySelector('i');
        if (!icon) return;

        if (isActive) {
            icon.className = 'ki-duotone ki-check fs-4';
            icon.innerHTML = '<span class="path1"></span><span class="path2"></span>';
        } else {
            icon.className = 'ki-duotone ki-plus fs-4';
            icon.innerHTML = '<span class="path1"></span><span class="path2"></span>';
        }
    }

    function atualizarBoxMultiplosLeads() {
        var botoesAtivos = document.querySelectorAll('.btn-check-lead.active');
        var quantidade = botoesAtivos.length;

        if (boxMultiplosLeads && contadorLeadsSelecionados) {
            contadorLeadsSelecionados.textContent = quantidade;

            if (quantidade > 0) {
                boxMultiplosLeads.classList.remove('d-none');
            } else {
                boxMultiplosLeads.classList.add('d-none');
            }
        }
    }

    document.querySelectorAll('.btn-comprar-lead').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var leadId = btn.getAttribute('data-lead-id');
            var card = btn.closest('.lead-card');
            if (!card) return;

            var cidade = card.getAttribute('data-cidade') || '';
            var estado = card.getAttribute('data-estado') || '';
            var preco = card.getAttribute('data-preco') || '0';

            var item = {
                leadId: leadId,
                fornecedor: fornecedorInfo.nome,
                cidade: cidade + ' - ' + estado,
                preco: preco
            };

            carrinho.push(item);
            localStorage.setItem('mercadaoCarrinho', JSON.stringify(carrinho));
            atualizarBadgeCarrinho();
            abrirCarrinho();

            var checkBtn = card.querySelector('.btn-check-lead');
            if (checkBtn) {
                checkBtn.classList.add('active');
                atualizarIconeBotao(checkBtn, true);
                atualizarBoxMultiplosLeads();
            }
        });
    });

    document.querySelectorAll('.btn-check-lead').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var isActive = btn.classList.contains('active');
            btn.classList.toggle('active');
            var novoEstado = btn.classList.contains('active');
            atualizarIconeBotao(btn, novoEstado);
            atualizarBoxMultiplosLeads();
        });
    });

    if (btnLimparSelecao) {
        btnLimparSelecao.addEventListener('click', function () {
            document.querySelectorAll('.btn-check-lead.active').forEach(function (btn) {
                btn.classList.remove('active');
                atualizarIconeBotao(btn, false);
            });
            atualizarBoxMultiplosLeads();
        });
    }

    if (btnAdicionarTodosCarrinho) {
        btnAdicionarTodosCarrinho.addEventListener('click', function () {
            var botoesAtivos = document.querySelectorAll('.btn-check-lead.active');
            var leadsAdicionados = 0;

            botoesAtivos.forEach(function (btn) {
                var leadId = btn.getAttribute('data-lead-id');
                var card = btn.closest('.lead-card');
                if (!card) return;

                var cidade = card.getAttribute('data-cidade') || '';
                var estado = card.getAttribute('data-estado') || '';
                var preco = card.getAttribute('data-preco') || '0';

                var item = {
                    leadId: leadId,
                    fornecedor: fornecedorInfo.nome,
                    cidade: cidade + ' - ' + estado,
                    preco: preco
                };

                carrinho.push(item);
                leadsAdicionados++;
            });

            if (leadsAdicionados > 0) {
                localStorage.setItem('mercadaoCarrinho', JSON.stringify(carrinho));
                atualizarBadgeCarrinho();
                atualizarCarrinho();
                abrirCarrinho();

                // Limpar seleção após adicionar
                botoesAtivos.forEach(function (btn) {
                    btn.classList.remove('active');
                    atualizarIconeBotao(btn, false);
                });
                atualizarBoxMultiplosLeads();
            }
        });
    }

    var temperaturaFiltroAtiva = '';

    function aplicarFiltros() {
        var texto = (inputBuscaLead && inputBuscaLead.value || '').toLowerCase().trim();
        var temperaturaSelecionada = temperaturaFiltroAtiva;
        var tipoSelecionado = selectTipoLead ? selectTipoLead.value : '';
        var precoMin = inputPrecoMin ? parseFloat(inputPrecoMin.value) : null;
        var precoMax = inputPrecoMax ? parseFloat(inputPrecoMax.value) : null;
        var ordenarPor = selectOrdenarPor ? selectOrdenarPor.value : 'recentes';

        var cardsVisiveis = [];

        cardsLeads.forEach(function (card) {
            var visivel = true;
            var textoCard = card.textContent.toLowerCase();
            var cardTemperatura = card.getAttribute('data-temperatura');
            var cardTipo = card.getAttribute('data-tipo');
            var cardPreco = parseFloat(card.getAttribute('data-preco')) || 0;

            if (texto && textoCard.indexOf(texto) === -1) {
                visivel = false;
            }

            if (visivel && temperaturaSelecionada && temperaturaSelecionada !== '' && cardTemperatura !== temperaturaSelecionada) {
                visivel = false;
            }

            if (visivel && tipoSelecionado && cardTipo !== tipoSelecionado) {
                visivel = false;
            }

            if (visivel && precoMin !== null && cardPreco < precoMin) {
                visivel = false;
            }

            if (visivel && precoMax !== null && cardPreco > precoMax) {
                visivel = false;
            }

            card.classList.toggle('d-none', !visivel);
            if (visivel) {
                cardsVisiveis.push(card);
            }
        });

        // Ordenar cards visíveis
        if (ordenarPor === 'preco-menor') {
            cardsVisiveis.sort(function(a, b) {
                var precoA = parseFloat(a.getAttribute('data-preco')) || 0;
                var precoB = parseFloat(b.getAttribute('data-preco')) || 0;
                return precoA - precoB;
            });
        } else if (ordenarPor === 'preco-maior') {
            cardsVisiveis.sort(function(a, b) {
                var precoA = parseFloat(a.getAttribute('data-preco')) || 0;
                var precoB = parseFloat(b.getAttribute('data-preco')) || 0;
                return precoB - precoA;
            });
        } else if (ordenarPor === 'recentes') {
            cardsVisiveis.sort(function(a, b) {
                var tempoA = parseInt(a.getAttribute('data-tempo')) || 0;
                var tempoB = parseInt(b.getAttribute('data-tempo')) || 0;
                return tempoA - tempoB;
            });
        }

        // Reordenar no DOM
        if (cardsVisiveis.length > 0 && containerLeads) {
            cardsVisiveis.forEach(function(card) {
                containerLeads.appendChild(card);
            });
        }

        if (mensagemSemResultados) {
            mensagemSemResultados.classList.toggle('d-none', cardsVisiveis.length > 0);
        }
    }

    if (btnBuscarLead && inputBuscaLead) {
        btnBuscarLead.addEventListener('click', aplicarFiltros);
        inputBuscaLead.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                aplicarFiltros();
            }
        });
    }

    btnsTemperatura.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var temperatura = btn.getAttribute('data-temperatura');
            var coresTemperatura = {
                'fervendo': { bg: '#fee2e2', border: '#dc3545', text: '#dc3545', icon: '#dc3545' },
                'quente': { bg: '#fff4e6', border: '#ff6600', text: '#ff6600', icon: '#ff6600' },
                'morno': { bg: '#fff7ed', border: '#ea580c', text: '#ea580c', icon: '#ea580c' },
                'frio': { bg: '#eff6ff', border: '#2563eb', text: '#2563eb', icon: '#2563eb' }
            };
            
            // Se clicar no mesmo botão, desmarcar
            if (temperaturaFiltroAtiva === temperatura) {
                temperaturaFiltroAtiva = '';
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-light');
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
                var icon = btn.querySelector('i');
                if (icon) {
                    icon.style.color = '#495057';
                }
            } else {
                // Desmarcar todos
                btnsTemperatura.forEach(function (b) {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-light');
                    b.style.backgroundColor = '';
                    b.style.borderColor = '';
                    b.style.color = '';
                    var icon = b.querySelector('i');
                    if (icon) {
                        icon.style.color = '#495057';
                    }
                });
                
                // Marcar o selecionado com a cor específica
                temperaturaFiltroAtiva = temperatura || '';
                var cor = coresTemperatura[temperatura];
                if (cor) {
                    btn.classList.remove('btn-light');
                    btn.style.backgroundColor = cor.bg;
                    btn.style.borderColor = cor.border;
                    btn.style.color = cor.text;
                    var icon = btn.querySelector('i');
                    if (icon) {
                        icon.style.color = cor.icon;
                    }
                }
            }
            
            aplicarFiltros();
        });
    });
    
    if (selectOrdenarPor) {
        selectOrdenarPor.addEventListener('change', aplicarFiltros);
    }
    
    if (selectTipoLead) {
        selectTipoLead.addEventListener('change', aplicarFiltros);
    }
    
    if (inputPrecoMin) {
        inputPrecoMin.addEventListener('change', aplicarFiltros);
        inputPrecoMin.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                aplicarFiltros();
            }
        });
    }
    
    if (inputPrecoMax) {
        inputPrecoMax.addEventListener('change', aplicarFiltros);
        inputPrecoMax.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                aplicarFiltros();
            }
        });
    }

    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener('click', aplicarFiltros);
    }

    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener('click', function () {
            if (inputBuscaLead) inputBuscaLead.value = '';
            if (selectTipoLead) selectTipoLead.value = '';
            if (inputPrecoMin) inputPrecoMin.value = '';
            if (inputPrecoMax) inputPrecoMax.value = '';
            if (selectOrdenarPor) selectOrdenarPor.value = 'recentes';

            btnsTemperatura.forEach(function (b) {
                b.classList.remove('btn-primary');
                b.classList.add('btn-light');
                b.style.backgroundColor = '';
                b.style.borderColor = '';
                b.style.color = '';
                var icon = b.querySelector('i');
                if (icon) {
                    icon.style.color = '#495057';
                }
            });
            temperaturaFiltroAtiva = '';

            aplicarFiltros();
        });
    }

    atualizarBadgeCarrinho();
    atualizarCarrinho();
    
    // Abrir carrinho ao clicar no ícone do carrinho
    var btnCarrinho = document.querySelector('.ki-handcart');
    if (btnCarrinho) {
        var btnCarrinhoParent = btnCarrinho.closest('button');
        if (btnCarrinhoParent) {
            btnCarrinhoParent.addEventListener('click', function() {
                abrirCarrinho();
            });
        }
    }
    
    // Não aplicar filtros automaticamente ao carregar - mostrar todos os cards
});
