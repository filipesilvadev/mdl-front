document.addEventListener('DOMContentLoaded', function () {
    const filtroBuscaLead = document.getElementById('filtroBuscaLead');
    const btnPesquisar = document.getElementById('btnPesquisar');
    const btnFiltros = document.getElementById('btnFiltros');
    const containerLeads = document.getElementById('containerLeads');
    const leadCards = document.querySelectorAll('.lead-card');
    const checkboxes = document.querySelectorAll('.lead-checkbox');
    const exportButtons = document.querySelectorAll('[data-export]');

    function filtrarLeads(termo) {
        const termoLower = termo.toLowerCase().trim();
        
        leadCards.forEach(card => {
            const nome = card.querySelector('.fw-bold.fs-4')?.textContent.toLowerCase() || '';
            const id = card.querySelector('.text-muted.fs-7')?.textContent.toLowerCase() || '';
            const telefone = card.querySelector('.d-flex.align-items-center.text-gray-700')?.textContent.toLowerCase() || '';
            
            if (nome.includes(termoLower) || id.includes(termoLower) || telefone.includes(termoLower)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (filtroBuscaLead) {
        filtroBuscaLead.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filtrarLeads(this.value);
            }
        });
    }

    if (btnPesquisar) {
        btnPesquisar.addEventListener('click', function() {
            const termo = filtroBuscaLead ? filtroBuscaLead.value : '';
            filtrarLeads(termo);
        });
    }

    const filtrosTemp = document.querySelectorAll('.js-filtro-temp');
    const btnLimparFiltros = document.getElementById('btnLimparFiltros');
    const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');
    const filtroPrecoMin = document.getElementById('filtroPrecoMin');
    const filtroPrecoMax = document.getElementById('filtroPrecoMax');
    const filtroData = document.getElementById('filtroData');
    const filtroOrdenarPor = document.getElementById('filtroOrdenarPor');

    function extrairPreco(texto) {
        const match = texto.match(/R\$\s*([\d.]+)/);
        if (match) {
            const valor = match[1].replace(/\./g, '');
            return parseFloat(valor);
        }
        return 0;
    }

    function extrairTemperatura(card) {
        const badge = card.querySelector('.badge');
        if (!badge) return '';
        const texto = badge.textContent.trim().toLowerCase();
        if (texto.includes('fervendo')) return 'fervendo';
        if (texto.includes('quente')) return 'quente';
        if (texto.includes('morno')) return 'morno';
        if (texto.includes('frio')) return 'frio';
        return '';
    }


    function aplicarFiltros() {
        const temperaturaSelecionada = document.querySelector('.js-filtro-temp.active')?.getAttribute('data-temperatura') || '';
        const precoMin = parseFloat(filtroPrecoMin?.value) || 0;
        const precoMax = parseFloat(filtroPrecoMax?.value) || Infinity;
        const dataFiltro = filtroData?.value || '';
        const ordenacao = filtroOrdenarPor?.value || 'recentes';

        const cardsFiltrados = [];

        leadCards.forEach(card => {
            let mostrar = true;

            if (temperaturaSelecionada) {
                const temperaturaCard = extrairTemperatura(card);
                if (temperaturaCard !== temperaturaSelecionada) {
                    mostrar = false;
                }
            }

            if (mostrar && (precoMin > 0 || precoMax < Infinity)) {
                const precoTexto = card.querySelector('.fw-bold.fs-3')?.textContent || '';
                const preco = extrairPreco(precoTexto);
                if (preco < precoMin || preco > precoMax) {
                    mostrar = false;
                }
            }

            if (mostrar && dataFiltro) {
                const tempoTexto = card.querySelector('.lead-col-status .fw-semibold.fs-7')?.textContent || '';
                if (!tempoTexto) {
                    mostrar = false;
                }
            }

            if (mostrar) {
                card.style.display = '';
                cardsFiltrados.push(card);
            } else {
                card.style.display = 'none';
            }
        });

        if (ordenacao !== 'recentes' && cardsFiltrados.length > 0) {
            ordenarCards(cardsFiltrados, ordenacao);
        }
    }

    function ordenarCards(cards, tipo) {
        const container = document.getElementById('containerLeads');
        if (!container) return;

        const cardsOrdenados = [...cards];
        
        cardsOrdenados.sort((a, b) => {
            if (tipo === 'preco-menor') {
                const precoA = extrairPreco(a.querySelector('.fw-bold.fs-3')?.textContent || '');
                const precoB = extrairPreco(b.querySelector('.fw-bold.fs-3')?.textContent || '');
                return precoA - precoB;
            } else if (tipo === 'preco-maior') {
                const precoA = extrairPreco(a.querySelector('.fw-bold.fs-3')?.textContent || '');
                const precoB = extrairPreco(b.querySelector('.fw-bold.fs-3')?.textContent || '');
                return precoB - precoA;
            }
            return 0;
        });

        cardsOrdenados.forEach(card => {
            container.appendChild(card);
        });
    }

    if (btnAplicarFiltros) {
        btnAplicarFiltros.addEventListener('click', function() {
            aplicarFiltros();
        });
    }

    filtrosTemp.forEach(btn => {
        btn.addEventListener('click', function() {
            filtrosTemp.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            aplicarFiltros();
        });
    });

    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener('click', function() {
            filtrosTemp.forEach(btn => btn.classList.remove('active'));
            if (filtroPrecoMin) filtroPrecoMin.value = '';
            if (filtroPrecoMax) filtroPrecoMax.value = '';
            if (filtroData) filtroData.value = '';
            if (filtroOrdenarPor) filtroOrdenarPor.value = 'recentes';
            
            leadCards.forEach(card => {
                card.style.display = '';
            });
        });
    }

    if (filtroOrdenarPor) {
        filtroOrdenarPor.addEventListener('change', function() {
            aplicarFiltros();
        });
    }

    if (filtroPrecoMin) {
        filtroPrecoMin.addEventListener('change', function() {
            aplicarFiltros();
        });
    }

    if (filtroPrecoMax) {
        filtroPrecoMax.addEventListener('change', function() {
            aplicarFiltros();
        });
    }

    if (filtroData) {
        filtroData.addEventListener('change', function() {
            aplicarFiltros();
        });
    }

    exportButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tipo = this.getAttribute('data-export');
            console.log(`Exportar como ${tipo}`);
        });
    });

    function atualizarContadorExportar() {
        const checkboxesSelecionados = document.querySelectorAll('.lead-checkbox:checked');
        const badgeContador = document.getElementById('badgeExportarContador');
        const quantidade = checkboxesSelecionados.length;
        
        if (badgeContador) {
            if (quantidade > 0) {
                badgeContador.textContent = quantidade;
                badgeContador.classList.remove('d-none');
            } else {
                badgeContador.classList.add('d-none');
            }
        }
    }

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const card = this.closest('.lead-card');
            if (this.checked) {
                card.style.backgroundColor = '#f8f9fa';
            } else {
                card.style.backgroundColor = '';
            }
            atualizarContadorExportar();
        });
    });

    const checkTodosLeads = document.getElementById('checkTodosLeads');
    if (checkTodosLeads) {
        checkTodosLeads.addEventListener('change', function() {
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
                const card = checkbox.closest('.lead-card');
                if (this.checked) {
                    card.style.backgroundColor = '#f8f9fa';
                } else {
                    card.style.backgroundColor = '';
                }
            });
            atualizarContadorExportar();
        });
    }

    atualizarContadorExportar();

    const modalDetalhesLead = document.getElementById('modalDetalhesLead');
    const btnFecharDetalhes = document.getElementById('btnFecharDetalhes');
    const btnFecharDetalhesFooter = document.getElementById('btnFecharDetalhesFooter');
    const botoesVerDetalhes = document.querySelectorAll('.btn-ver-detalhes');

    function extrairIniciais(nome) {
        const partes = nome.trim().split(' ');
        if (partes.length >= 2) {
            return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
        }
        return nome.substring(0, 2).toUpperCase();
    }

    function abrirModalDetalhes(card) {
        const nome = card.querySelector('.lead-col-name .fw-bold.fs-4')?.textContent.trim() || '';
        const idTexto = card.querySelector('.lead-col-name .text-muted.fs-7')?.textContent.trim() || '';
        const telefoneElement = card.querySelectorAll('.lead-col-contact .d-flex.align-items-center.text-gray-700 span.fw-semibold')[0];
        const telefone = telefoneElement?.textContent.trim() || '';
        const cpfElement = card.querySelectorAll('.lead-col-contact .d-flex.align-items-center.text-gray-700 span.fw-semibold')[1];
        const cpf = cpfElement?.textContent.trim() || '';
        const planoElement = card.querySelector('.lead-col-plan .d-flex.align-items-center.justify-content-between .d-flex.align-items-center .fw-semibold');
        const plano = planoElement?.textContent.trim() || card.querySelector('.lead-col-plan .fw-semibold')?.textContent.trim() || '';
        const precoElement = card.querySelector('.lead-col-plan .fw-bold.fs-3');
        const preco = precoElement?.textContent.trim() || '';
        const statusBadge = card.querySelector('.lead-col-status .badge');
        const statusTexto = statusBadge?.textContent.trim() || '';
        const tempoElement = card.querySelector('.lead-col-status .fw-semibold.fs-7');
        const tempo = tempoElement?.textContent.trim() || '';
        
        const codigoLead = idTexto.replace('ID: ', '').trim() || 'ML-0000';
        const email = nome.toLowerCase().replace(/\s+/g, '') + '@email.com';
        const endereco = 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP';
        const localizacao = 'São Paulo, SP';
        
        const avatarInicials = document.getElementById('leadAvatarInitials');
        const nomeCompleto = document.getElementById('leadNomeCompleto');
        const codigo = document.getElementById('leadCodigo');
        const localizacaoEl = document.getElementById('leadLocalizacao');
        const telefoneCompleto = document.getElementById('leadTelefoneCompleto');
        const cpfCompleto = document.getElementById('leadCpfCompleto');
        const emailEl = document.getElementById('leadEmail');
        const enderecoEl = document.getElementById('leadEndereco');
        const planoCompleto = document.getElementById('leadPlanoCompleto');
        const precoCompleto = document.getElementById('leadPrecoCompleto');
        const statusBadgeModal = document.getElementById('leadStatusBadge');

        if (avatarInicials) avatarInicials.textContent = extrairIniciais(nome);
        if (nomeCompleto) nomeCompleto.textContent = nome;
        if (codigo) codigo.textContent = 'Cód: ' + codigoLead;
        if (localizacaoEl) localizacaoEl.textContent = localizacao;
        if (telefoneCompleto) telefoneCompleto.textContent = telefone;
        if (cpfCompleto) cpfCompleto.textContent = cpf.replace(/\*/g, '0');
        if (emailEl) emailEl.textContent = email;
        if (enderecoEl) enderecoEl.textContent = endereco;
        if (planoCompleto) planoCompleto.textContent = plano;
        if (precoCompleto) {
            const precoFormatado = preco.replace('/mês', '').trim() + ',00 / mês';
            precoCompleto.textContent = precoFormatado;
        }

        if (statusBadgeModal && statusBadge) {
            const statusText = statusTexto;
            let statusBgColor = '#ffebee';
            let statusColor = '#dc3545';
            let statusIconClass = 'ki-pulse';
            let badgeClass = 'badge-light-danger';
            
            if (statusTexto.includes('Fervendo') || statusTexto.includes('Super Quente')) {
                statusBgColor = '#ffebee';
                statusColor = '#dc3545';
                statusIconClass = 'ki-pulse';
                badgeClass = 'badge-light-danger';
            } else if (statusTexto.includes('Quente')) {
                statusBgColor = '#fff4e6';
                statusColor = '#ff6600';
                statusIconClass = 'ki-abstract-15';
                badgeClass = '';
            } else if (statusTexto.includes('Morno')) {
                statusBgColor = '#fff7ed';
                statusColor = '#ea580c';
                statusIconClass = 'ki-abstract-22';
                badgeClass = '';
            } else if (statusTexto.includes('Frio')) {
                statusBgColor = '#eff6ff';
                statusColor = '#2563eb';
                statusIconClass = 'ki-snow';
                badgeClass = '';
            }
            
            statusBadgeModal.className = `badge ${badgeClass} fw-semibold px-3 py-2 d-flex align-items-center`;
            statusBadgeModal.innerHTML = `
                <i class="ki-duotone ${statusIconClass} fs-4 me-1" style="color: ${statusColor};">
                    <span class="path1"></span>
                    <span class="path2"></span>
                </i>
                ${statusText}
            `;
            statusBadgeModal.style.backgroundColor = statusBgColor;
            statusBadgeModal.style.color = statusColor;
        }

        const historicoEl = document.getElementById('leadHistorico');
        if (historicoEl && tempo) {
            const agora = new Date();
            const horas = agora.getHours();
            const minutos = agora.getMinutes();
            const horaFormatada = String(horas).padStart(2, '0') + ':' + String(minutos).padStart(2, '0');
            
            historicoEl.innerHTML = `
                <div class="modal-timeline-item">
                    <div class="modal-timeline-dot"></div>
                    <div class="modal-timeline-content">
                        <div class="fw-bold fs-6 mb-1">Novo Lead</div>
                        <div class="text-muted fs-7 mb-1">Via Landing Page</div>
                        <div class="text-muted fs-7">Hoje, ${horaFormatada}</div>
                    </div>
                </div>
            `;
        }

        if (modalDetalhesLead) {
            modalDetalhesLead.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function fecharModalDetalhes() {
        if (modalDetalhesLead) {
            modalDetalhesLead.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    botoesVerDetalhes.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.lead-card');
            if (card) {
                abrirModalDetalhes(card);
            }
        });
    });

    if (btnFecharDetalhes) {
        btnFecharDetalhes.addEventListener('click', fecharModalDetalhes);
    }

    if (modalDetalhesLead) {
        modalDetalhesLead.addEventListener('click', function(event) {
            if (event.target === modalDetalhesLead) {
                fecharModalDetalhes();
            }
        });
    }

    if (modalDetalhesLead) {
        modalDetalhesLead.addEventListener('click', function(event) {
            if (event.target === modalDetalhesLead) {
                fecharModalDetalhes();
            }
        });
    }
});

