document.addEventListener('DOMContentLoaded', function () {
    const toggles = document.querySelectorAll('.integration-toggle');
    const btnNovaFonte = document.getElementById('btnNovaFonte');
    const botoesVerDetalhes = document.querySelectorAll('.btn-ver-detalhes');
    const modalNovaFonte = document.getElementById('modalNovaFonte');
    const platformCards = document.querySelectorAll('.platform-card');
    const btnSalvarConectar = document.getElementById('btnSalvarConectar');
    const btnCopiarApiKey = document.getElementById('btnCopiarApiKey');
    const inputApiKey = document.getElementById('inputApiKey');
    const containerIntegracoes = document.getElementById('containerIntegracoes');

    let selectedPlatform = 'meta';

    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const card = this.closest('.integration-card');
            const badge = card.querySelector('.badge');
            const integrationId = this.id;
            
            if (this.checked) {
                badge.className = 'badge badge-light-success fw-semibold px-3 py-2';
                badge.textContent = 'Ativo';
            } else {
                badge.className = 'badge badge-light-secondary fw-semibold px-3 py-2';
                badge.textContent = 'Inativo';
            }
        });
    });

    if (btnNovaFonte) {
        btnNovaFonte.addEventListener('click', function() {
            const modal = new bootstrap.Modal(modalNovaFonte);
            modal.show();
        });
    }

    platformCards.forEach(card => {
        card.addEventListener('click', function() {
            platformCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedPlatform = this.getAttribute('data-platform');
        });
    });

    if (btnCopiarApiKey) {
        btnCopiarApiKey.addEventListener('click', function() {
            if (inputApiKey) {
                inputApiKey.select();
                inputApiKey.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(inputApiKey.value).then(() => {
                    const originalText = btnCopiarApiKey.innerHTML;
                    btnCopiarApiKey.innerHTML = '<i class="ki-duotone ki-check fs-2 me-1"><span class="path1"></span><span class="path2"></span></i>Copiado!';
                    btnCopiarApiKey.classList.add('btn-success');
                    btnCopiarApiKey.classList.remove('btn-light');
                    setTimeout(() => {
                        btnCopiarApiKey.innerHTML = originalText;
                        btnCopiarApiKey.classList.remove('btn-success');
                        btnCopiarApiKey.classList.add('btn-light');
                    }, 2000);
                });
            }
        });
    }

    if (btnSalvarConectar) {
        btnSalvarConectar.addEventListener('click', function() {
            const nomeCampanha = document.getElementById('inputNomeCampanha').value || 'Nova Integração #01';
            const apiKey = inputApiKey ? inputApiKey.value : '';

            const platformData = {
                meta: {
                    icon: '<span class="fw-bold" style="color: #1877f2; font-size: 2.5rem;">f</span>',
                    iconClass: 'integration-icon-facebook',
                    title: 'Meta Ads (Facebook)',
                    description: 'Formulários nativos com mapeamento'
                },
                google: {
                    icon: '<span class="fw-bold" style="color: #ea4335; font-size: 2.5rem;">G</span>',
                    iconClass: 'integration-icon-google',
                    title: 'Google Ads / Forms',
                    description: 'Conexão via Webhook para LPs'
                },
                api: {
                    icon: '<i class="ki-duotone ki-code" style="color: #5e6278; font-size: 2.5rem;"><span class="path1"></span><span class="path2"></span></i>',
                    iconClass: 'integration-icon-api',
                    title: 'API Própria / CRM',
                    description: 'Integre seu sistema legado via JSON'
                }
            };

            const data = platformData[selectedPlatform];
            const uniqueId = 'toggle' + Date.now();
            const cardId = 'card' + Date.now();

            const newCardHTML = `
                <div class="col-12 col-lg-4">
                    <div class="card integration-card" id="${cardId}">
                        <div class="card-body p-6">
                            <div class="d-flex justify-content-between align-items-start mb-4">
                                <div class="d-flex align-items-center">
                                    <div class="integration-icon ${data.iconClass} me-3">
                                        ${data.icon}
                                    </div>
                                    <div>
                                        <h3 class="fw-bold fs-5 mb-1" style="color: #181c32;">${data.title}</h3>
                                        <p class="text-muted fs-7 mb-0">${data.description}</p>
                                    </div>
                                </div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input integration-toggle" type="checkbox" id="${uniqueId}" checked>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-end mb-4">
                                <span class="badge badge-light-success fw-semibold px-3 py-2">Ativo</span>
                                <div class="text-end">
                                    <div class="fw-bold fs-2x mb-0" style="color: #181c32;">0</div>
                                    <div class="text-muted fs-7">Leads Hoje</div>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <button type="button" class="btn btn-light fw-semibold px-6 w-100 btn-ver-detalhes" data-integration="${selectedPlatform}">
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            containerIntegracoes.insertAdjacentHTML('beforeend', newCardHTML);

            const newToggle = document.getElementById(uniqueId);
            if (newToggle) {
                newToggle.addEventListener('change', function() {
                    const card = this.closest('.integration-card');
                    const badge = card.querySelector('.badge');
                    
                    if (this.checked) {
                        badge.className = 'badge badge-light-success fw-semibold px-3 py-2';
                        badge.textContent = 'Ativo';
                    } else {
                        badge.className = 'badge badge-light-secondary fw-semibold px-3 py-2';
                        badge.textContent = 'Inativo';
                    }
                });
            }

            const newBtnDetalhes = document.querySelector(`#${cardId} .btn-ver-detalhes`);
            if (newBtnDetalhes) {
                newBtnDetalhes.addEventListener('click', function() {
                    const card = this.closest('.integration-card');
                    const integration = this.getAttribute('data-integration');
                    abrirModalDetalhes(card, integration);
                });
            }

            const modal = bootstrap.Modal.getInstance(modalNovaFonte);
            if (modal) {
                modal.hide();
            }

            document.getElementById('inputNomeCampanha').value = 'Nova Integração #01';
            platformCards.forEach(c => c.classList.remove('selected'));
            document.querySelector('.platform-card-meta').classList.add('selected');
            selectedPlatform = 'meta';
        });
    }

    botoesVerDetalhes.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.integration-card');
            const integration = this.getAttribute('data-integration');
            abrirModalDetalhes(card, integration);
        });
    });

    function abrirModalDetalhes(card, integration) {
        const modalDetalhes = document.getElementById('modalDetalhesIntegracao');
        const modalIntegrationTitle = document.getElementById('modalIntegrationTitle');
        const modalStatusBadge = document.getElementById('modalStatusBadge');
        const modalIconContainer = document.getElementById('modalIconContainer');
        const modalLeadsHoje = document.getElementById('modalLeadsHoje');
        const modalTotalHistorico = document.getElementById('modalTotalHistorico');
        const modalApiKey = document.getElementById('modalApiKey');
        const modalNomeInterno = document.getElementById('modalNomeInterno');
        const toggle = card.querySelector('.integration-toggle');
        const badge = card.querySelector('.badge');
        const leadsHoje = card.querySelector('.fw-bold.fs-2x')?.textContent.trim() || '0';
        const title = card.querySelector('h3.fw-bold.fs-5')?.textContent.trim() || '';
        const icon = card.querySelector('.integration-icon').innerHTML;
        const iconClass = card.querySelector('.integration-icon').className.split(' ').find(c => c.includes('integration-icon-'));

        const integrationData = {
            meta: {
                title: 'Meta Ads (Facebook)',
                icon: '<span class="fw-bold" style="color: #1877f2; font-size: 2.5rem;">f</span>',
                iconClass: 'integration-icon-facebook',
                totalHistorico: '1.284'
            },
            google: {
                title: 'Google Ads / Forms',
                icon: '<span class="fw-bold" style="color: #ea4335; font-size: 2.5rem;">G</span>',
                iconClass: 'integration-icon-google',
                totalHistorico: '856'
            },
            api: {
                title: 'API Própria / CRM',
                icon: '<i class="ki-duotone ki-code" style="color: #5e6278; font-size: 2.5rem;"><span class="path1"></span><span class="path2"></span></i>',
                iconClass: 'integration-icon-api',
                totalHistorico: '0'
            }
        };

        const data = integrationData[integration] || integrationData.meta;
        const isActive = toggle?.checked || false;

        if (modalIntegrationTitle) modalIntegrationTitle.textContent = data.title;
        if (modalIconContainer) {
            modalIconContainer.className = `integration-icon ${data.iconClass} me-3`;
            modalIconContainer.innerHTML = data.icon;
        }
        if (modalStatusBadge) {
            if (isActive) {
                modalStatusBadge.className = 'badge badge-light-success fw-semibold px-3 py-2';
                modalStatusBadge.textContent = 'Ativo';
            } else {
                modalStatusBadge.className = 'badge badge-light-secondary fw-semibold px-3 py-2';
                modalStatusBadge.textContent = 'Inativo';
            }
        }
        if (modalLeadsHoje) {
            modalLeadsHoje.textContent = leadsHoje;
            modalLeadsHoje.style.color = '#e81979';
        }
        if (modalTotalHistorico) {
            modalTotalHistorico.textContent = data.totalHistorico;
            modalTotalHistorico.style.color = '#e81979';
        }
        if (modalApiKey) modalApiKey.value = 'ml_live_992837482_secure_token';
        if (modalNomeInterno) modalNomeInterno.value = title || 'Campanha Institucional 2024';

        card.setAttribute('data-current-card', 'true');
        document.querySelectorAll('.integration-card[data-current-card]').forEach(c => {
            if (c !== card) c.removeAttribute('data-current-card');
        });

        const modal = new bootstrap.Modal(modalDetalhes);
        modal.show();
    }

    const btnToggleApiKey = document.getElementById('btnToggleApiKey');
    const iconToggleApiKey = document.getElementById('iconToggleApiKey');
    const modalApiKey = document.getElementById('modalApiKey');
    let apiKeyVisible = false;

    if (btnToggleApiKey && modalApiKey) {
        btnToggleApiKey.addEventListener('click', function() {
            apiKeyVisible = !apiKeyVisible;
            if (apiKeyVisible) {
                modalApiKey.type = 'text';
                iconToggleApiKey.className = 'ki-duotone ki-eye-slash fs-2';
            } else {
                modalApiKey.type = 'password';
                iconToggleApiKey.className = 'ki-duotone ki-eye fs-2';
            }
            iconToggleApiKey.innerHTML = '<span class="path1"></span><span class="path2"></span><span class="path3"></span>';
        });
    }

    const btnCopiarApiKeyModal = document.getElementById('btnCopiarApiKeyModal');
    if (btnCopiarApiKeyModal && modalApiKey) {
        btnCopiarApiKeyModal.addEventListener('click', function() {
            modalApiKey.select();
            modalApiKey.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(modalApiKey.value).then(() => {
                const originalHTML = btnCopiarApiKeyModal.innerHTML;
                btnCopiarApiKeyModal.innerHTML = '<i class="ki-duotone ki-check fs-2"><span class="path1"></span><span class="path2"></span></i>';
                btnCopiarApiKeyModal.classList.add('btn-success');
                btnCopiarApiKeyModal.classList.remove('btn-light');
                setTimeout(() => {
                    btnCopiarApiKeyModal.innerHTML = originalHTML;
                    btnCopiarApiKeyModal.classList.remove('btn-success');
                    btnCopiarApiKeyModal.classList.add('btn-light');
                }, 2000);
            });
        });
    }

    const btnSalvarIntegracao = document.getElementById('btnSalvarIntegracao');
    if (btnSalvarIntegracao) {
        btnSalvarIntegracao.addEventListener('click', function() {
            const nomeInterno = document.getElementById('modalNomeInterno').value;
            console.log('Salvar integração:', nomeInterno);
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesIntegracao'));
            if (modal) {
                modal.hide();
            }
        });
    }

    const btnDeletarIntegracao = document.getElementById('btnDeletarIntegracao');
    if (btnDeletarIntegracao) {
        btnDeletarIntegracao.addEventListener('click', function() {
            const currentCard = document.querySelector('.integration-card[data-current-card]');
            if (currentCard && confirm('Tem certeza que deseja deletar esta integração?')) {
                const cardContainer = currentCard.closest('.col-12');
                if (cardContainer) {
                    cardContainer.remove();
                }
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalDetalhesIntegracao'));
                if (modal) {
                    modal.hide();
                }
            }
        });
    }

    if (modalNovaFonte) {
        modalNovaFonte.addEventListener('show.bs.modal', function() {
            platformCards.forEach(c => c.classList.remove('selected'));
            document.querySelector('.platform-card-meta').classList.add('selected');
            selectedPlatform = 'meta';
        });
    }
});



