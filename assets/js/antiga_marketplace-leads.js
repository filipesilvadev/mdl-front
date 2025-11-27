// Inicialização única e segura
$(document).ready(function() {
    // Primeira tentativa após document ready
    setTimeout(function() {
        attemptInitialization();
    }, 800);
    
    // Segunda tentativa se a primeira falhar (fallback)
    setTimeout(function() {
        attemptInitialization();
    }, 2000);
});

function attemptInitialization() {
    if (typeof $.fn.DataTable !== 'undefined' && $('#kt_marketplace_leads_table').length > 0) {
        if (!$.fn.DataTable.isDataTable('#kt_marketplace_leads_table')) {
            console.log('Inicializando Marketplace Leads...');
            addMarketplaceStyles();
            initializeMarketplaceLeads();
        }
    }
}

function initializeMarketplaceLeads() {
    if (typeof $.fn.DataTable === 'undefined') {
        console.error('DataTables não está carregado!');
        return;
    }
    
    if ($('#kt_marketplace_leads_table').length === 0) {
        console.error('Tabela não encontrada!');
        return;
    }
    
    // Verificar se o DataTable já foi inicializado
    if ($.fn.DataTable.isDataTable('#kt_marketplace_leads_table')) {
        console.log('DataTable já inicializado, pulando...');
        return;
    }
    
    var table = $('#kt_marketplace_leads_table').DataTable({
        "info": false,
        "order": [],
        "pageLength": 10,
        "lengthChange": false,
        "searching": true,
        "ordering": true,
        "language": {
            "emptyTable": "Nenhum fornecedor de leads encontrado",
            "search": "Buscar:",
            "zeroRecords": "Nenhum resultado encontrado",
            "paginate": {
                "first": "Primeiro",
                "last": "Último", 
                "next": "Próximo",
                "previous": "Anterior"
            }
        },
        "columnDefs": [{
            "targets": [5], 
            "orderable": false
        }],
        "responsive": true,
        "dom": 'rtip',
        "drawCallback": function(settings) {
            // Forçar aplicação dos estilos rosa na paginação após cada redesenho
            applyPinkPaginationStyles();
        }
    });

    // Aplicar estilos iniciais
    setTimeout(function() {
        applyPinkPaginationStyles();
    }, 100);

    $('#search-input').on('keyup', function() {
        var searchValue = this.value;
        table.search(searchValue).draw();
        
        // Destacar termo pesquisado
        if (searchValue) {
            highlightSearchTerm(searchValue);
        }
    });


    $('#apply-filters').on('click', function() {
        var temperatura = $('#temperatura-filter').val();
        
        if (temperatura) {
            table.column(2).search(temperatura).draw();
        } else {
            table.column(2).search('').draw();
        }
        
        // Fechar dropdown de filtros
        $('[data-kt-menu="true"]').removeClass('show');
    });

    // ===== Reset de Filtros =====
    $('#reset-filters').on('click', function() {
        $('#temperatura-filter').val('');
        $('#search-input').val('');
        table.search('').columns().search('').draw();
        
        // Fechar dropdown de filtros
        $('[data-kt-menu="true"]').removeClass('show');
    });

    // ===== Ação do Botão Adquirir =====
    $(document).on('click', '.btn-adquirir', function(e) {
        e.preventDefault();
        
        // Obter dados completos do fornecedor
        var $row = $(this).closest('tr');
        var nomeFornecedor = $row.find('.fs-5.fw-bold').text().trim();
        var fornecedor = $row.find('.text-muted.fs-7').text().trim();
        var quantidade = $row.find('.badge-qtd-leads').text().replace(/[^\d]/g, '').trim();
        var temperatura = $row.find('.badge:not(.badge-qtd-leads)').text().trim();
        var preco = $row.find('.text-dark.fs-5').text().trim();
        var thumbSrc = $row.find('.symbol-label img').attr('src');
        
        Swal.fire({
            title: 'Confirmar Aquisição',
            html: `
                <div class="d-flex flex-column align-items-center text-start w-100">
                    <div class="d-flex align-items-center mb-4 w-100">
                        <div class="symbol symbol-60px me-3">
                            <div class="symbol-label">
                                <img src="${thumbSrc}" alt="${nomeFornecedor}" class="w-100" />
                            </div>
                        </div>
                        <div>
                            <h5 class="mb-1 text-gray-800">${nomeFornecedor}</h5>
                            <div class="text-muted fs-7">${fornecedor}</div>
                        </div>
                    </div>
                    
                    <div class="w-100">
                        <div class="row gx-5 mb-3">
                            <div class="col-6">
                                <strong>Quantidade:</strong><br>
                                <span class="badge badge-light-primary">${quantidade} leads</span>
                            </div>
                            <div class="col-6">
                                <strong>Temperatura:</strong><br>
                                <span class="badge ${getTemperatureBadgeClass(temperatura)}">${temperatura}</span>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <strong>Valor Total:</strong><br>
                            <span class="fs-3 fw-bold text-primary">${preco}</span>
                        </div>
                        
                        <hr class="my-4">
                        <p class="text-muted mb-0">Deseja confirmar a aquisição deste fornecedor de leads?</p>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, adquirir',
            cancelButtonText: 'Cancelar',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-light'
            },
            buttonsStyling: false,
            width: 500
        }).then((result) => {
            if (result.isConfirmed) {
                // Simular processamento
                Swal.fire({
                    title: 'Processando...',
                    text: 'Aguarde enquanto processamos sua solicitação',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    willOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Simular delay de processamento
                setTimeout(() => {
                    Swal.fire({
                        title: 'Sucesso!',
                        html: `
                            <div class="text-center">
                                <p>Fornecedor de leads adquirido com sucesso!</p>
                                <p class="text-muted">Você receberá um e-mail com os detalhes da compra.</p>
                            </div>
                        `,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'btn btn-primary'
                        },
                        buttonsStyling: false
                    });
                }, 2000);
            }
        });
    });

    // ===== Funcionalidades Auxiliares =====

    // Função para obter classe CSS do badge de temperatura
    function getTemperatureBadgeClass(temperatura) {
        switch(temperatura.toLowerCase()) {
            case 'quente':
                return 'badge-light-danger';
            case 'morno':
                return 'badge-light-warning';
            case 'frio':
                return 'badge-light-info';
            default:
                return 'badge-light-secondary';
        }
    }

    // Destacar termo de busca
    function highlightSearchTerm(term) {
        // Remove highlights anteriores
        $('.highlight').removeClass('highlight');
        
        if (term.length > 2) {
            // Adiciona highlight aos termos encontrados
            $('table tbody td').each(function() {
                var text = $(this).text();
                if (text.toLowerCase().includes(term.toLowerCase())) {
                    $(this).addClass('highlight');
                }
            });
        }
    }

    // Tooltip nos badges de rating
    $('.rating').each(function() {
        var stars = $(this).find('.checked').length;
        $(this).attr('title', `${stars} de 5 estrelas`);
    });

    // Animação ao carregar a página
    $('.table tbody tr').each(function(index) {
        $(this).css({
            'opacity': '0',
            'transform': 'translateY(20px)'
        }).delay(index * 50).animate({
            'opacity': '1'
        }, 300).css('transform', 'translateY(0)');
    });

    // Responsividade - ajustar tabela em mobile
    function adjustTableForMobile() {
        if ($(window).width() < 768) {
            $('#kt_marketplace_leads_table').addClass('table-responsive');
        } else {
            $('#kt_marketplace_leads_table').removeClass('table-responsive');
        }
    }

    // Chamar na inicialização e no resize
    adjustTableForMobile();
    $(window).resize(adjustTableForMobile);
}

// Função global para obter classe CSS do badge de temperatura
function getTemperatureBadgeClass(temperatura) {
    switch(temperatura.toLowerCase()) {
        case 'quente':
            return 'badge-light-danger';
        case 'morno':
            return 'badge-light-warning';
        case 'frio':
            return 'badge-light-info';
        default:
            return 'badge-light-secondary';
    }
}

// Função para forçar estilos rosa na paginação
function applyPinkPaginationStyles() {
    // Aplicar estilos diretamente via JavaScript
    setTimeout(function() {
        // Botões ativos
        $('.dataTables_wrapper .paginate_button.current, .page-item.active .page-link').each(function() {
            $(this).css({
                'background-color': '#e71d73 !important',
                'background': '#e71d73 !important',
                'border-color': '#e71d73 !important',
                'color': 'white !important'
            });
        });
        
        // Adicionar event listeners para manter a cor nos botões
        $('.dataTables_wrapper .paginate_button').on('click', function() {
            setTimeout(() => applyPinkPaginationStyles(), 50);
        });
        
    }, 50);
}

function addMarketplaceStyles() {
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .highlight {
                background-color: rgba(255, 193, 7, 0.2) !important;
                transition: background-color 0.3s ease;
            }
            
            .table tbody tr {
                animation: fadeInUp 0.3s ease;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Forçar estilos rosa na paginação via JavaScript */
            .dataTables_wrapper .paginate_button.current {
                background-color: #e71d73 !important;
                background: #e71d73 !important;
                border-color: #e71d73 !important;
                color: white !important;
            }
        `)
        .appendTo('head');
}

$(document).ready(function() {
    setTimeout(function() {
        if (typeof $.fn.DataTable === 'undefined' || !$.fn.DataTable.isDataTable('#kt_marketplace_leads_table')) {
            console.warn('DataTables não disponível, carregando funcionalidades básicas...');
            initializeBasicFunctionality();
        }
    }, 3000);
});

function initializeBasicFunctionality() {
    $('#search-input').on('keyup', function() {
        var value = $(this).val().toLowerCase();
        $('#kt_marketplace_leads_table tbody tr').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
    
    $('#apply-filters').on('click', function() {
        var temperatura = $('#temperatura-filter').val();
        if (temperatura) {
            $('#kt_marketplace_leads_table tbody tr').each(function() {
                var rowTemp = $(this).find('td:nth-child(3)').text();
                $(this).toggle(rowTemp.includes(temperatura));
            });
        }
    });
    
    $('#reset-filters').on('click', function() {
        $('#temperatura-filter').val('');
        $('#search-input').val('');
        $('#kt_marketplace_leads_table tbody tr').show();
    });
    
    $(document).on('click', '.btn-adquirir', function(e) {
        e.preventDefault();
        var $row = $(this).closest('tr');
        var nomeFornecedor = $row.find('.fs-5.fw-bold').text();
        var preco = $row.find('.text-dark.fs-5').text();
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Confirmar Aquisição',
                html: `<p><strong>Fornecedor:</strong> ${nomeFornecedor}</p>`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim, adquirir',
                cancelButtonText: 'Cancelar'
            });
        } else {
            alert('Confirmar aquisição do fornecedor: ' + nomeFornecedor + ' - ' + preco);
        }
    });
} 