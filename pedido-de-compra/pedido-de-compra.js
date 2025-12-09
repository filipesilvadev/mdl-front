document.addEventListener('DOMContentLoaded', function () {
    var contadorProdutos = 1;
    var formaPagamentoSelecionada = 'creditos'; // Padrão: Créditos
    var produtos = [];

    // Inicializar primeiro produto
    inicializarProduto(1);
    
    // Inicializar validação de distribuição para o produto inicial
    setTimeout(function() {
        validarDistribuicaoLeads(1);
    }, 100);

    // Função para inicializar um produto
    function inicializarProduto(index) {
        var produto = {
            index: index,
            tipoLead: '',
            observacoesRegionais: '',
            qtdTotal: 50,
            dataInicio: '',
            ddd: '',
            volumesDiarios: {
                seg: null,
                ter: null,
                qua: null,
                qui: null,
                sex: null,
                sab: null,
                dom: null
            },
            precoUnitario: 0,
            subtotal: 0
        };
        produtos[index] = produto;
        atualizarCalculosProduto(index);
    }

    // Função para atualizar cálculos de um produto
    function atualizarCalculosProduto(index) {
        var produto = produtos[index];
        if (!produto) return;

        // Calcular preço unitário baseado no tipo de lead e região
        var precoBase = 0;
        if (produto.tipoLead === 'pf') {
            precoBase = 18.90;
        } else if (produto.tipoLead === 'pj') {
            precoBase = 45.50;
        } else if (produto.tipoLead === 'pme') {
            precoBase = 125.00;
        } else if (produto.tipoLead === 'adesao') {
            precoBase = 35.00;
        }

        produto.precoUnitario = precoBase;
        produto.subtotal = precoBase * produto.qtdTotal;

        // Atualizar exibição
        var precoElement = document.getElementById('precoUnitario' + index);
        var subtotalElement = document.getElementById('subtotal' + index);

        if (precoElement) {
            precoElement.textContent = 'R$ ' + produto.precoUnitario.toFixed(2).replace('.', ',');
        }
        if (subtotalElement) {
            subtotalElement.textContent = 'R$ ' + produto.subtotal.toFixed(2).replace('.', ',');
        }

        atualizarTotais();
    }

    // Função para atualizar totais gerais
    function atualizarTotais() {
        var totalLeads = 0;
        var valorTotal = 0;

        produtos.forEach(function(produto) {
            if (produto) {
                totalLeads += produto.qtdTotal || 0;
                valorTotal += produto.subtotal || 0;
            }
        });

        var totalLeadsElement = document.getElementById('totalLeads');
        var valorTotalElement = document.getElementById('valorTotal');

        if (totalLeadsElement) {
            totalLeadsElement.textContent = totalLeads;
        }
        if (valorTotalElement) {
            valorTotalElement.textContent = 'R$ ' + valorTotal.toFixed(2).replace('.', ',');
        }
    }

    // Event listeners para campos do produto
    document.querySelectorAll('.select-tipo-lead').forEach(function(select) {
        select.addEventListener('change', function() {
            var index = parseInt(select.getAttribute('data-produto-index'));
            if (produtos[index]) {
                produtos[index].tipoLead = select.value;
                atualizarCalculosProduto(index);
            }
        });
    });

    document.querySelectorAll('.input-qtd-total').forEach(function(input) {
        input.addEventListener('change', function() {
            var index = parseInt(input.getAttribute('data-produto-index'));
            if (produtos[index]) {
                produtos[index].qtdTotal = parseInt(input.value) || 0;
                atualizarCalculosProduto(index);
                validarDistribuicaoLeads(index);
            }
        });
    });

    document.querySelectorAll('.input-observacoes-regionais').forEach(function(input) {
        input.addEventListener('change', function() {
            var index = parseInt(input.getAttribute('data-produto-index'));
            if (produtos[index]) {
                produtos[index].observacoesRegionais = input.value;
            }
        });
    });

    document.querySelectorAll('.input-data-inicio').forEach(function(input) {
        input.addEventListener('change', function() {
            var index = parseInt(input.getAttribute('data-produto-index'));
            if (produtos[index]) {
                produtos[index].dataInicio = input.value;
            }
        });
    });

    document.querySelectorAll('.select-ddd').forEach(function(select) {
        select.addEventListener('change', function() {
            var index = parseInt(select.getAttribute('data-produto-index'));
            if (produtos[index]) {
                produtos[index].ddd = select.value;
            }
        });
    });

    // Função para calcular a soma dos volumes diários de um produto
    function calcularSomaVolumesDiarios(index) {
        var produto = produtos[index];
        if (!produto || !produto.volumesDiarios) return 0;

        var soma = 0;
        var dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
        dias.forEach(function(dia) {
            if (produto.volumesDiarios[dia] !== null && produto.volumesDiarios[dia] !== undefined) {
                soma += produto.volumesDiarios[dia] || 0;
            }
        });
        return soma;
    }

    // Função para validar e limitar a distribuição de leads
    function validarDistribuicaoLeads(index) {
        var produto = produtos[index];
        if (!produto) return;

        var qtdTotal = produto.qtdTotal || 0;
        var somaVolumes = calcularSomaVolumesDiarios(index);

        // Se a soma ultrapassar a Qtd. Total, ajustar os valores
        if (somaVolumes > qtdTotal && qtdTotal > 0) {
            // Calcular a proporção para ajustar todos os valores
            var proporcao = qtdTotal / somaVolumes;
            var dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
            var novoValorTotal = 0;

            dias.forEach(function(dia) {
                if (produto.volumesDiarios[dia] !== null && produto.volumesDiarios[dia] !== undefined) {
                    var valorOriginal = produto.volumesDiarios[dia] || 0;
                    var novoValor = Math.floor(valorOriginal * proporcao);
                    produto.volumesDiarios[dia] = novoValor;
                    novoValorTotal += novoValor;

                    // Atualizar o input no DOM
                    var input = document.querySelector('.input-volume-diario[data-produto-index="' + index + '"][data-dia="' + dia + '"]');
                    if (input) {
                        input.value = novoValor || '';
                    }
                }
            });

            // Ajustar a diferença no primeiro dia não nulo para não perder leads
            var diferenca = qtdTotal - novoValorTotal;
            if (diferenca > 0) {
                for (var i = 0; i < dias.length && diferenca > 0; i++) {
                    var dia = dias[i];
                    if (produto.volumesDiarios[dia] !== null && produto.volumesDiarios[dia] !== undefined && produto.volumesDiarios[dia] > 0) {
                        produto.volumesDiarios[dia] += diferenca;
                        var input = document.querySelector('.input-volume-diario[data-produto-index="' + index + '"][data-dia="' + dia + '"]');
                        if (input) {
                            input.value = produto.volumesDiarios[dia];
                        }
                        diferenca = 0;
                    }
                }
            }

            alert('A soma dos volumes diários não pode ultrapassar a Qtd. Total (' + qtdTotal + '). Os valores foram ajustados automaticamente.');
        }

        // Atualizar o atributo max de todos os inputs de volume diário
        var produtoElement = document.querySelector('[data-produto-index="' + index + '"]');
        if (produtoElement) {
            var inputsVolume = produtoElement.querySelectorAll('.input-volume-diario');
            inputsVolume.forEach(function(input) {
                var diaAtual = input.getAttribute('data-dia');
                var somaAtualSemEsteDia = 0;
                var dias = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
                
                dias.forEach(function(dia) {
                    if (dia !== diaAtual && produto.volumesDiarios[dia] !== null && produto.volumesDiarios[dia] !== undefined) {
                        somaAtualSemEsteDia += produto.volumesDiarios[dia] || 0;
                    }
                });

                var maxPermitido = Math.max(0, qtdTotal - somaAtualSemEsteDia);
                input.setAttribute('max', maxPermitido);
                
                // Se o valor atual ultrapassar o máximo permitido, ajustar
                var valorAtual = parseInt(input.value) || 0;
                if (valorAtual > maxPermitido && maxPermitido > 0) {
                    input.value = maxPermitido;
                    produto.volumesDiarios[diaAtual] = maxPermitido;
                }
            });
        }
    }

    document.querySelectorAll('.input-volume-diario').forEach(function(input) {
        input.addEventListener('change', function() {
            var index = parseInt(input.getAttribute('data-produto-index'));
            var dia = input.getAttribute('data-dia');
            if (produtos[index] && produtos[index].volumesDiarios) {
                var valor = parseInt(input.value) || null;
                produtos[index].volumesDiarios[dia] = valor;
                validarDistribuicaoLeads(index);
            }
        });
    });

    // Botão adicionar produto
    var btnAdicionarProduto = document.getElementById('btnAdicionarProduto');
    if (btnAdicionarProduto) {
        btnAdicionarProduto.addEventListener('click', function() {
            contadorProdutos++;
            adicionarNovoProduto(contadorProdutos);
        });
    }

    // Função para adicionar novo produto
    function adicionarNovoProduto(index) {
        var containerProdutos = document.getElementById('containerProdutos');
        if (!containerProdutos) return;

        var novoProdutoHTML = `
            <div class="card mb-6 produto-item" data-produto-index="${index}">
                <div class="card-body py-6 px-6">
                    <div class="d-flex justify-content-between align-items-center mb-6">
                        <div class="d-flex align-items-center">
                            <span class="badge badge-light-primary fw-semibold px-3 py-2 me-3" style="background-color: #e8e3ff; color: #6d28d9;">Produto #${index}</span>
                            <h4 class="fw-bold text-gray-900 fs-5 mb-0">Configuração do Lead</h4>
                        </div>
                        <button type="button" class="btn btn-icon btn-light btn-sm btn-remover-produto" data-produto-index="${index}">
                            <i class="ki-duotone ki-trash fs-2 text-danger">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                                <span class="path4"></span>
                                <span class="path5"></span>
                            </i>
                        </button>
                    </div>

                    <div class="row g-6">
                        <!-- Coluna Esquerda -->
                        <div class="col-12 col-md-4">
                            <div class="d-flex flex-column gap-6">
                                <div>
                                    <label class="form-label fw-semibold text-gray-700 mb-2">Tipo de Lead</label>
                                    <select class="form-select form-select-solid select-tipo-lead" data-produto-index="${index}">
                                        <option value="">Selecione...</option>
                                        <option value="pf">Pessoa Física</option>
                                        <option value="pj">Pessoa Jurídica</option>
                                        <option value="pme">PME / Empresarial</option>
                                        <option value="adesao">Adesão</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label fw-semibold text-gray-700 mb-2">Região (DDD)</label>
                                    <select class="form-select form-select-solid select-ddd" data-produto-index="${index}">
                                        <option value="">DDD...</option>
                                        <option value="11">11 - São Paulo</option>
                                        <option value="21">21 - Rio de Janeiro</option>
                                        <option value="31">31 - Belo Horizonte</option>
                                        <option value="41">41 - Curitiba</option>
                                        <option value="51">51 - Porto Alegre</option>
                                        <option value="61">61 - Brasília</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Coluna Meio -->
                        <div class="col-12 col-md-4">
                            <div>
                                <label class="form-label fw-semibold text-gray-700 mb-2">Observações Regionais</label>
                                <textarea class="form-control form-control-solid input-observacoes-regionais" data-produto-index="${index}" rows="4" placeholder="Ex: Exceto Diadema; Somente Zona Sul..."></textarea>
                                <div class="alert alert-warning d-flex align-items-center p-3 mt-3 mb-0" style="background-color: #fff3cd; border-color: #ffc107;">
                                    <i class="ki-duotone ki-information-5 fs-2 me-2" style="color: #856404;">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                        <span class="path3"></span>
                                    </i>
                                    <div class="fs-7" style="color: #846303; line-height: 1.35em;">Pedidos especiais neste campo não aceitam contestação. Apenas o DDD é garantido.</div>
                                </div>
                            </div>
                        </div>

                        <!-- Coluna Direita -->
                        <div class="col-12 col-md-4">
                            <div class="d-flex flex-column gap-6">
                                <div class="row g-3">
                                    <div class="col-6">
                                        <label class="form-label fw-semibold text-gray-700 mb-2">Qtd. Total</label>
                                        <input type="number" class="form-control form-control-solid input-qtd-total" data-produto-index="${index}" value="50" min="1" />
                                    </div>
                                    <div class="col-6">
                                        <label class="form-label fw-semibold text-gray-700 mb-2">Data de Início</label>
                                        <div class="input-group">
                                            <input type="text" class="form-control form-control-solid input-data-inicio" data-produto-index="${index}" placeholder="dd/mm/aaaa" />
                                            <span class="input-group-text bg-transparent">
                                                <i class="ki-duotone ki-calendar fs-2 text-gray-500">
                                                    <span class="path1"></span>
                                                    <span class="path2"></span>
                                                    <span class="path3"></span>
                                                    <span class="path4"></span>
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label class="form-label fw-semibold text-gray-700 mb-3">Volume Máximo Diário</label>
                                    <div class="d-flex gap-2 volume-diario-container">
                                        <div class="volume-diario-item">
                                            <label class="form-label fs-8 text-muted mb-1">SEG</label>
                                            <input type="number" class="form-control form-control-solid input-volume-diario" data-produto-index="${index}" data-dia="seg" placeholder="-" min="0" />
                                        </div>
                                        <div class="volume-diario-item">
                                            <label class="form-label fs-8 text-muted mb-1">TER</label>
                                            <input type="number" class="form-control form-control-solid input-volume-diario" data-produto-index="${index}" data-dia="ter" placeholder="-" min="0" />
                                        </div>
                                        <div class="volume-diario-item">
                                            <label class="form-label fs-8 text-muted mb-1">QUA</label>
                                            <input type="number" class="form-control form-control-solid input-volume-diario" data-produto-index="${index}" data-dia="qua" placeholder="-" min="0" />
                                        </div>
                                        <div class="volume-diario-item">
                                            <label class="form-label fs-8 text-muted mb-1">QUI</label>
                                            <input type="number" class="form-control form-control-solid input-volume-diario" data-produto-index="${index}" data-dia="qui" placeholder="-" min="0" />
                                        </div>
                                        <div class="volume-diario-item">
                                            <label class="form-label fs-8 text-muted mb-1">SEX</label>
                                            <input type="number" class="form-control form-control-solid input-volume-diario" data-produto-index="${index}" data-dia="sex" placeholder="-" min="0" />
                                        </div>
                                        <div class="volume-diario-item">
                                            <label class="form-label fs-8 text-muted mb-1">SÁB</label>
                                            <input type="number" class="form-control form-control-solid input-volume-diario" data-produto-index="${index}" data-dia="sab" placeholder="-" min="0" />
                                        </div>
                                        <div class="volume-diario-item">
                                            <label class="form-label fs-8 text-muted mb-1">DOM</label>
                                            <input type="number" class="form-control form-control-solid input-volume-diario" data-produto-index="${index}" data-dia="dom" placeholder="-" min="0" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="d-flex justify-content-between align-items-center pt-4 border-top">
                                <div>
                                    <span class="text-muted fs-7">Preço Unitário:</span>
                                    <span class="fw-bold fs-5 text-gray-900 ms-2" id="precoUnitario${index}">R$ 0,00</span>
                                </div>
                                <div>
                                    <span class="text-muted fs-7">Subtotal:</span>
                                    <span class="fw-bold fs-5 ms-2" style="color: #ff007a;" id="subtotal${index}">R$ 0,00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Inserir antes do botão de adicionar produto
        var btnAdicionarContainer = btnAdicionarProduto.closest('.card');
        if (btnAdicionarContainer) {
            btnAdicionarContainer.insertAdjacentHTML('beforebegin', novoProdutoHTML);
        }

        // Inicializar novo produto
        inicializarProduto(index);

        // Adicionar event listeners aos novos campos
        adicionarEventListenersProduto(index);

        // Inicializar validação de distribuição
        validarDistribuicaoLeads(index);
    }

    // Função para adicionar event listeners a um produto
    function adicionarEventListenersProduto(index) {
        var produtoElement = document.querySelector('[data-produto-index="' + index + '"]');
        if (!produtoElement) return;

        var selectTipoLead = produtoElement.querySelector('.select-tipo-lead');
        if (selectTipoLead) {
            selectTipoLead.addEventListener('change', function() {
                if (produtos[index]) {
                    produtos[index].tipoLead = selectTipoLead.value;
                    atualizarCalculosProduto(index);
                }
            });
        }

        var inputQtdTotal = produtoElement.querySelector('.input-qtd-total');
        if (inputQtdTotal) {
            inputQtdTotal.addEventListener('change', function() {
                if (produtos[index]) {
                    produtos[index].qtdTotal = parseInt(inputQtdTotal.value) || 0;
                    atualizarCalculosProduto(index);
                    validarDistribuicaoLeads(index);
                }
            });
        }

        var inputObservacoes = produtoElement.querySelector('.input-observacoes-regionais');
        if (inputObservacoes) {
            inputObservacoes.addEventListener('change', function() {
                if (produtos[index]) {
                    produtos[index].observacoesRegionais = inputObservacoes.value;
                }
            });
        }

        var inputDataInicio = produtoElement.querySelector('.input-data-inicio');
        if (inputDataInicio) {
            inputDataInicio.addEventListener('change', function() {
                if (produtos[index]) {
                    produtos[index].dataInicio = inputDataInicio.value;
                }
            });
        }

        var selectDdd = produtoElement.querySelector('.select-ddd');
        if (selectDdd) {
            selectDdd.addEventListener('change', function() {
                if (produtos[index]) {
                    produtos[index].ddd = selectDdd.value;
                }
            });
        }

        var inputsVolume = produtoElement.querySelectorAll('.input-volume-diario');
        inputsVolume.forEach(function(input) {
            input.addEventListener('change', function() {
                var dia = input.getAttribute('data-dia');
                if (produtos[index] && produtos[index].volumesDiarios) {
                    var valor = parseInt(input.value) || null;
                    produtos[index].volumesDiarios[dia] = valor;
                    validarDistribuicaoLeads(index);
                }
            });
        });

        var btnRemover = produtoElement.querySelector('.btn-remover-produto');
        if (btnRemover) {
            btnRemover.addEventListener('click', function() {
                removerProduto(index);
            });
        }
    }

    // Função para remover produto
    function removerProduto(index) {
        var produtoElement = document.querySelector('[data-produto-index="' + index + '"]');
        if (produtoElement) {
            produtoElement.remove();
            delete produtos[index];
            atualizarTotais();
        }
    }

    // Event listeners para remover produto (produto inicial)
    document.querySelectorAll('.btn-remover-produto').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var index = parseInt(btn.getAttribute('data-produto-index'));
            removerProduto(index);
        });
    });

    // Seleção de forma de pagamento
    document.querySelectorAll('.forma-pagamento').forEach(function(card) {
        card.addEventListener('click', function() {
            // Remover seleção anterior
            document.querySelectorAll('.forma-pagamento').forEach(function(c) {
                c.classList.remove('active');
                c.style.border = '';
                c.style.backgroundColor = '';
                var icon = c.querySelector('i');
                if (icon && !c.getAttribute('data-forma').includes('creditos') && !c.getAttribute('data-forma').includes('pagar-fora')) {
                    icon.style.color = '';
                }
            });

            // Selecionar nova forma
            var forma = card.getAttribute('data-forma');
            formaPagamentoSelecionada = forma;
            card.classList.add('active');

            // Aplicar estilos específicos
            if (forma === 'creditos') {
                card.style.border = '2px solid #ff007a';
                card.style.backgroundColor = '#fff5f8';
            } else if (forma === 'pagar-fora') {
                card.style.border = '2px solid #ffc107';
                card.style.backgroundColor = '#fffbf0';
            } else {
                card.style.border = '2px solid #ff007a';
                card.style.backgroundColor = '#fff5f8';
                var icon = card.querySelector('i');
                if (icon) {
                    icon.style.color = '#ff007a';
                }
            }
        });
    });

    // Marcar créditos como selecionado por padrão
    var cardCreditos = document.querySelector('[data-forma="creditos"]');
    if (cardCreditos) {
        cardCreditos.classList.add('active');
    }

    // Botão enviar pedido
    var btnEnviarPedido = document.getElementById('btnEnviarPedido');
    if (btnEnviarPedido) {
        btnEnviarPedido.addEventListener('click', function() {
            // Validar produtos
            var produtosValidos = 0;
            produtos.forEach(function(produto) {
                if (produto && produto.tipoLead && produto.qtdTotal > 0) {
                    produtosValidos++;
                }
            });

            if (produtosValidos === 0) {
                alert('Por favor, configure pelo menos um produto com tipo de lead e quantidade.');
                return;
            }

            // Preparar dados do pedido
            var dadosPedido = {
                id: document.getElementById('pedidoId').textContent,
                fornecedor: 'Alpha Leads',
                produtos: produtos.filter(function(p) { return p !== undefined; }),
                observacoes: document.getElementById('observacoesPedido').value,
                formaPagamento: formaPagamentoSelecionada,
                totalLeads: parseInt(document.getElementById('totalLeads').textContent) || 0,
                valorTotal: parseFloat(document.getElementById('valorTotal').textContent.replace('R$ ', '').replace(',', '.')) || 0
            };

            console.log('Pedido enviado:', dadosPedido);
            alert('Pedido enviado com sucesso! O fornecedor analisará seu pedido.');
            
            // Aqui você pode fazer uma chamada AJAX para enviar os dados ao servidor
            // Exemplo:
            // fetch('/api/pedidos', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(dadosPedido)
            // });
        });
    }

    // Inicializar máscara de data (opcional - pode usar biblioteca externa)
    document.querySelectorAll('.input-data-inicio').forEach(function(input) {
        input.addEventListener('input', function(e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            if (value.length >= 5) {
                value = value.substring(0, 5) + '/' + value.substring(5, 9);
            }
            e.target.value = value;
        });
    });
});

