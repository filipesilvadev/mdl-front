/**
 * Marketplace Horizontal - Nova Versão
 * Sistema de busca horizontal avançada para pacotes de leads imobiliários
 */

class MarketplaceHorizontal {
    constructor() {
        this.packages = [
            {
                id: 1,
                title: "Leads Automotivos Premium",
                company: "AutoLeads Corp",
                price: 2450,
                quantity: 250,
                temperature: "quente",
                rating: 5,
                tags: ["automotivo", "premium"]
            },
            {
                id: 2,
                title: "Leads E-commerce Validados",
                company: "DigitalSales Ltda",
                price: 1890,
                quantity: 180,
                temperature: "morno",
                rating: 4,
                tags: ["e-commerce", "validados"]
            },
            {
                id: 3,
                title: "Leads Saúde Premium",
                company: "HealthLeads Pro",
                price: 3200,
                quantity: 320,
                temperature: "frio",
                rating: 5,
                tags: ["saúde", "premium"]
            }
        ];
        
        this.filteredPackages = [...this.packages];
        this.currentSort = 'relevance';
        this.searchTimeout = null;
        
        this.init();
    }

    init() {
        this.initializeComponents();
        this.bindEvents();
        this.updateDisplay();
    }

    initializeComponents() {
        if (typeof KTDialer !== 'undefined') {
            KTDialer.createInstances();
        }
        
        if (typeof $ !== 'undefined' && $.fn.select2) {
            $('[data-control="select2"]').select2({
                minimumResultsForSearch: Infinity
            });
        }
    }

    bindEvents() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }

        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.handleSort(e.target.value);
            });
        }

        const cardViewBtn = document.getElementById('card-view-btn');
        const tableViewBtn = document.getElementById('table-view-btn');
        
        if (cardViewBtn) {
            cardViewBtn.addEventListener('click', () => {
                this.switchView('cards');
            });
        }
        
        if (tableViewBtn) {
            tableViewBtn.addEventListener('click', () => {
                this.switchView('table');
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-adquirir') || e.target.closest('.btn-adquirir')) {
                this.handlePurchase(e);
            }
        });

        const searchForm = document.getElementById('kt_marketplace_search_form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdvancedSearch();
            });
        }
    }

    handleSearch(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        if (!term) {
            this.filteredPackages = [...this.packages];
        } else {
            this.filteredPackages = this.packages.filter(pkg => 
                pkg.title.toLowerCase().includes(term) ||
                pkg.company.toLowerCase().includes(term) ||
                pkg.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }
        
        this.updateDisplay();
    }

    handleSort(sortType) {
        this.currentSort = sortType;
        
        switch (sortType) {
            case 'price_low':
                this.filteredPackages.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                this.filteredPackages.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredPackages.sort((a, b) => b.rating - a.rating);
                break;
            case 'recent':
                this.filteredPackages.sort((a, b) => b.id - a.id);
                break;
            default:
                this.filteredPackages.sort((a, b) => a.id - b.id);
        }
        
        this.updateDisplay();
    }

    switchView(viewType) {
        const cardsContainer = document.getElementById('cards-container');
        const tableContainer = document.getElementById('table-container');
        
        if (viewType === 'cards') {
            this.renderCards();
        } else {
            this.renderTable();
        }
    }

    updateDisplay() {
        this.updatePackageCount();
        this.updateSortLabel();
        this.renderCards();
        this.renderTable();
    }

    updatePackageCount() {
        const totalElement = document.getElementById('total-packages');
        if (totalElement) {
            totalElement.textContent = this.filteredPackages.length;
        }
    }

    updateSortLabel() {
        const sortLabels = {
            'relevance': 'Relevância',
            'price_low': 'Menor Preço',
            'price_high': 'Maior Preço',
            'rating': 'Melhor Avaliado',
            'recent': 'Mais Recentes'
        };
        
        const currentSortElement = document.getElementById('current-sort');
        if (currentSortElement) {
            currentSortElement.textContent = sortLabels[this.currentSort] || 'Relevância';
        }
    }

    renderCards() {
        const container = document.getElementById('cards-container');
        if (!container) return;

        if (this.filteredPackages.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-10">
                    <i class="ki-duotone ki-search-list fs-3x text-gray-400 mb-5">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                    </i>
                    <h3 class="text-gray-800 fw-bold mb-2">Nenhum fornecedor encontrado</h3>
                    <p class="text-gray-400">Tente ajustar os filtros de busca</p>
                </div>
            `;
            return;
        }

        const cardsHTML = this.filteredPackages.map(pkg => this.generateCardHTML(pkg)).join('');
        container.innerHTML = cardsHTML;
    }

    renderTable() {
        const container = document.getElementById('table-container');
        if (!container) return;

        if (this.filteredPackages.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-10">
                        <i class="ki-duotone ki-search-list fs-3x text-gray-400 mb-5">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                        </i>
                        <h3 class="text-gray-800 fw-bold mb-2">Nenhum fornecedor encontrado</h3>
                        <p class="text-gray-400">Tente ajustar os filtros de busca</p>
                    </td>
                </tr>
            `;
            return;
        }

        const rowsHTML = this.filteredPackages.map(pkg => this.generateTableRowHTML(pkg)).join('');
        container.innerHTML = rowsHTML;
    }

    generateCardHTML(pkg) {
        const temperatureConfig = {
            'quente': { 
                class: 'temperature-hot bg-light-danger', 
                icon: 'ki-fire', 
                color: 'text-danger',
                label: 'Quente'
            },
            'morno': { 
                class: 'temperature-warm bg-light-warning', 
                icon: 'ki-flash', 
                color: 'text-warning',
                label: 'Morno'
            },
            'frio': { 
                class: 'temperature-cold bg-light-info', 
                icon: 'ki-snowflake', 
                color: 'text-info',
                label: 'Frio'
            }
        };

        const tempConfig = temperatureConfig[pkg.temperature] || temperatureConfig['frio'];
        const stars = Array.from({length: 5}, (_, i) => 
            `<div class="rating-label me-2 ${i < pkg.rating ? 'checked' : ''}">
                <i class="ki-duotone ki-star fs-5"></i>
            </div>`
        ).join('');

        return `
            <div class="col-md-6 col-xxl-4 package-card" data-title="${pkg.title}" data-company="${pkg.company}" data-price="${pkg.price}" data-quantity="${pkg.quantity}" data-temperature="${pkg.temperature}">
                <div class="card marketplace-package-card">
                    <div class="card-body d-flex flex-center flex-column pt-12 p-9">
                        <div class="symbol symbol-75px symbol-circle mb-5 ${tempConfig.class}">
                            <div class="symbol-label ${tempConfig.class}">
                                <i class="ki-duotone ${tempConfig.icon} fs-1 ${tempConfig.color}">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    ${pkg.temperature === 'frio' ? '<span class="path3"></span><span class="path4"></span>' : ''}
                                </i>
                            </div>
                        </div>
                        
                        <div class="rating mb-3">
                            ${stars}
                        </div>
                        
                        <a href="#" class="fs-4 text-gray-800 text-hover-primary fw-bold mb-2 text-center">${pkg.title}</a>
                        <div class="fw-semibold text-gray-400 mb-3">por ${pkg.company}</div>
                        
                        <div class="fs-3 fw-bold text-gray-700 mb-6">R$ ${pkg.price.toLocaleString('pt-BR')}</div>
                        
                        <div class="d-flex justify-content-center align-items-center w-100 mb-6">
                            <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-4 mx-2 text-center">
                                <div class="fs-5 fw-bold text-gray-700">${pkg.quantity}</div>
                                <div class="fs-7 text-gray-400">Leads</div>
                            </div>
                            <div class="border border-gray-300 border-dashed rounded min-w-80px py-3 px-4 mx-2 text-center">
                                <div class="fs-5 fw-bold ${tempConfig.color}">${tempConfig.label}</div>
                                <div class="fs-7 text-gray-400">Temperatura</div>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary btn-sm fw-bold btn-adquirir" data-package-id="${pkg.id}">
                            <i class="ki-duotone ki-basket fs-4 me-1">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                                <span class="path4"></span>
                            </i>Adquirir
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateTableRowHTML(pkg) {
        const temperatureConfig = {
            'quente': { 
                class: 'bg-light-danger', 
                icon: 'ki-fire', 
                color: 'text-danger',
                badgeClass: 'badge-light-danger',
                bulletClass: 'bg-danger',
                label: 'Quente'
            },
            'morno': { 
                class: 'bg-light-warning', 
                icon: 'ki-flash', 
                color: 'text-warning',
                badgeClass: 'badge-light-warning',
                bulletClass: 'bg-warning',
                label: 'Morno'
            },
            'frio': { 
                class: 'bg-light-info', 
                icon: 'ki-snowflake', 
                color: 'text-info',
                badgeClass: 'badge-light-info',
                bulletClass: 'bg-info',
                label: 'Frio'
            }
        };

        const tempConfig = temperatureConfig[pkg.temperature] || temperatureConfig['frio'];
        const stars = Array.from({length: 5}, (_, i) => 
            `<div class="rating-label me-2 ${i < pkg.rating ? 'checked' : ''}">
                <i class="ki-duotone ki-star fs-5"></i>
            </div>`
        ).join('');

        return `
            <tr class="package-row" data-title="${pkg.title}" data-company="${pkg.company}" data-price="${pkg.price}" data-quantity="${pkg.quantity}" data-temperature="${pkg.temperature}">
                <td>
                    <div class="d-flex align-items-center">
                        <div class="symbol symbol-60px overflow-hidden me-3">
                            <div class="symbol-label ${tempConfig.class}">
                                <i class="ki-duotone ${tempConfig.icon} fs-3 ${tempConfig.color}">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    ${pkg.temperature === 'frio' ? '<span class="path3"></span><span class="path4"></span>' : ''}
                                </i>
                            </div>
                        </div>
                        <div class="ms-3">
                            <a href="#" class="text-gray-800 text-hover-primary fs-5 fw-bold">${pkg.title}</a>
                            <div class="text-muted fs-7">Por ${pkg.company}</div>
                        </div>
                    </div>
                </td>
                <td class="text-center">
                    <span class="badge badge-lg badge-light-primary fw-bold">${pkg.quantity}</span>
                </td>
                <td class="text-center">
                    <span class="badge ${tempConfig.badgeClass}">
                        <span class="bullet bullet-dot ${tempConfig.bulletClass} me-2"></span>${tempConfig.label}
                    </span>
                </td>
                <td class="text-center">
                    <div class="rating">
                        ${stars}
                    </div>
                </td>
                <td class="text-end pe-0">
                    <span class="fw-bold text-dark fs-5">R$ ${pkg.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                </td>
                <td class="text-end">
                    <button class="btn btn-primary btn-sm fw-bold btn-adquirir" data-package-id="${pkg.id}">
                        <i class="ki-duotone ki-basket fs-4 me-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                            <span class="path4"></span>
                        </i>Adquirir
                    </button>
                </td>
            </tr>
        `;
    }

    handlePurchase(e) {
        e.preventDefault();
        const button = e.target.closest('.btn-adquirir');
        const packageId = button?.getAttribute('data-package-id');
        
        if (packageId) {
            const pkg = this.packages.find(p => p.id == packageId);
            if (pkg) {
                this.showPurchaseModal(pkg);
            }
        }
    }

    showPurchaseModal(pkg) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Confirmar Compra',
                html: `
                    <div class="text-center">
                        <h4 class="mb-3">${pkg.title}</h4>
                        <p class="mb-2"><strong>Empresa:</strong> ${pkg.company}</p>
                        <p class="mb-2"><strong>Quantidade:</strong> ${pkg.quantity} leads</p>
                        <p class="mb-2"><strong>Temperatura:</strong> ${pkg.temperature}</p>
                        <p class="mb-4"><strong>Preço:</strong> R$ ${pkg.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Confirmar Compra',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    this.processPurchase(pkg);
                }
            });
        } else {
            if (confirm(`Confirmar compra do fornecedor "${pkg.title}" por R$ ${pkg.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}?`)) {
                this.processPurchase(pkg);
            }
        }
    }

    processPurchase(pkg) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Compra Realizada!',
                text: `Fornecedor "${pkg.title}" adquirido com sucesso!`,
                icon: 'success',
                timer: 3000,
                showConfirmButton: false
            });
        } else {
            alert(`Compra realizada com sucesso!\nFornecedor: ${pkg.title}`);
        }
    }

    handleAdvancedSearch() {
        console.log('Busca avançada acionada');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new MarketplaceHorizontal();
});

if (typeof KTApp !== 'undefined') {
    KTApp.ready(function() {
        new MarketplaceHorizontal();
    });
}