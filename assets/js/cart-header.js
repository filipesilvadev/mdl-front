document.addEventListener('DOMContentLoaded', function() {
    const cartNotificationBadge = document.getElementById('cart-notification-badge');
    const cartCount = document.getElementById('cart-count');
    const cartCountText = document.getElementById('cart-count-text');
    const cartEmptyState = document.getElementById('cart-empty-state');
    const cartItems = document.getElementById('cart-items');
    const cartSeparator = document.getElementById('cart-separator');
    const cartTotalSection = document.getElementById('cart-total-section');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartActions = document.getElementById('cart-actions');
    const cartTitle = document.getElementById('cart-title');

    let cartData = JSON.parse(localStorage.getItem('cart_items') || '[]');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    function updateCartDisplay() {
        const itemCount = cartData.length;
        
        cartCountText.textContent = itemCount;
        
        if (itemCount > 0) {
            cartNotificationBadge.style.display = 'block';
            cartCount.textContent = itemCount;
            cartEmptyState.classList.add('d-none');
            cartItems.classList.remove('d-none');
            cartSeparator.style.display = 'block';
            cartTotalSection.style.display = 'flex';
            cartActions.style.display = 'block';
            
            renderCartItems();
            updateCartTotal();
        } else {
            cartNotificationBadge.style.display = 'none';
            cartEmptyState.classList.remove('d-none');
            cartItems.classList.add('d-none');
            cartSeparator.style.display = 'none';
            cartTotalSection.style.display = 'none';
            cartActions.style.display = 'none';
        }
    }

    function renderCartItems() {
        const suppliers = {};
        
        cartData.forEach(item => {
            if (!suppliers[item.supplier]) {
                suppliers[item.supplier] = [];
            }
            suppliers[item.supplier].push(item);
        });

        let html = '';
        Object.keys(suppliers).forEach(supplier => {
            const leads = suppliers[supplier];
            const supplierTotal = leads.reduce((sum, lead) => sum + lead.price, 0);
            
            html += `
                <div class="d-flex flex-column mb-6">
                    <div class="d-flex align-items-center mb-3">
                        <div class="symbol symbol-40px me-3">
                            <div class="symbol-label bg-light-primary">
                                <i class="ki-duotone ki-shop fs-2 text-primary">
                                    <span class="path1"></span>
                                    <span class="path2"></span>
                                    <span class="path3"></span>
                                    <span class="path4"></span>
                                    <span class="path5"></span>
                                </i>
                            </div>
                        </div>
                        <div class="flex-grow-1">
                            <div class="fw-bold text-gray-800 fs-6">${supplier}</div>
                            <div class="text-muted fs-7">${leads.length} lead${leads.length > 1 ? 's' : ''} - ${formatCurrency(supplierTotal)}</div>
                        </div>
                        <button type="button" class="btn btn-icon btn-sm btn-light-danger" onclick="removeSupplierFromCart('${supplier}')">
                            <i class="ki-duotone ki-trash fs-5">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                                <span class="path4"></span>
                                <span class="path5"></span>
                            </i>
                        </button>
                    </div>
                </div>
            `;
        });

        cartItems.innerHTML = html;
    }

    function updateCartTotal() {
        const total = cartData.reduce((sum, item) => sum + item.price, 0);
        cartTotalAmount.textContent = formatCurrency(total);
    }

    window.addToCart = function(leadData) {
        const existingIndex = cartData.findIndex(item => item.id === leadData.id);
        if (existingIndex === -1) {
            cartData.push(leadData);
            localStorage.setItem('cart_items', JSON.stringify(cartData));
            updateCartDisplay();
            
            if (typeof toastr !== 'undefined') {
                toastr.success(`Lead "${leadData.name}" adicionado ao carrinho!`);
            } else {
                console.log(`Lead "${leadData.name}" adicionado ao carrinho!`);
            }
        } else {
            if (typeof toastr !== 'undefined') {
                toastr.info('Este lead já está no seu carrinho.');
            } else {
                console.log('Este lead já está no seu carrinho.');
            }
        }
    };

    window.removeFromCart = function(leadId) {
        cartData = cartData.filter(item => item.id !== leadId);
        localStorage.setItem('cart_items', JSON.stringify(cartData));
        updateCartDisplay();
        if (typeof toastr !== 'undefined') {
            toastr.info('Lead removido do carrinho.');
        } else {
            console.log('Lead removido do carrinho.');
        }
    };

    window.removeSupplierFromCart = function(supplier) {
        const removedCount = cartData.filter(item => item.supplier === supplier).length;
        cartData = cartData.filter(item => item.supplier !== supplier);
        localStorage.setItem('cart_items', JSON.stringify(cartData));
        updateCartDisplay();
        if (typeof toastr !== 'undefined') {
            toastr.info(`${removedCount} lead${removedCount > 1 ? 's' : ''} de ${supplier} removido${removedCount > 1 ? 's' : ''} do carrinho.`);
        } else {
            console.log(`${removedCount} lead${removedCount > 1 ? 's' : ''} de ${supplier} removido${removedCount > 1 ? 's' : ''} do carrinho.`);
        }
    };

    window.clearCart = function() {
        cartData = [];
        localStorage.setItem('cart_items', JSON.stringify(cartData));
        updateCartDisplay();
        if (typeof toastr !== 'undefined') {
            toastr.info('Carrinho limpo com sucesso.');
        } else {
            console.log('Carrinho limpo com sucesso.');
        }
    };

    window.getCartData = function() {
        return cartData;
    };

    window.simulateCartData = function() {
        const sampleData = [
            {
                id: 'lead_1',
                name: 'João Silva - Automotivo',
                supplier: 'AutoLeads Pro',
                price: 245.00,
                temperature: 'quente'
            },
            {
                id: 'lead_2',
                name: 'Maria Santos - E-commerce',
                supplier: 'DigitalLeads',
                price: 189.00,
                temperature: 'morno'
            },
            {
                id: 'lead_3',
                name: 'Carlos Pereira - Saúde',
                supplier: 'HealthLeads Pro',
                price: 312.00,
                temperature: 'quente'
            }
        ];
        
        cartData = sampleData;
        localStorage.setItem('cart_items', JSON.stringify(cartData));
        updateCartDisplay();
        console.log('Dados de exemplo carregados no carrinho! Use simulateCartData() no console para testar.');
        if (typeof toastr !== 'undefined') {
            toastr.success('Dados de exemplo carregados no carrinho!');
        }
    };

    updateCartDisplay();

    if (cartCountText) {
        cartCountText.textContent = cartData.length;
    }

    if (window.location.pathname.includes('/marketplace')) {
        setTimeout(() => {
            const purchaseButtons = document.querySelectorAll('.btn-primary');
            purchaseButtons.forEach(button => {
                if (button.textContent.includes('Adquirir') || button.textContent.includes('Comprar')) {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        const card = this.closest('.card') || this.closest('tr');
                        if (card) {
                            const leadName = card.querySelector('.fs-3, .fs-5, .text-gray-800')?.textContent?.trim() || 'Lead';
                            const supplierElement = card.querySelector('.text-muted');
                            const supplier = supplierElement ? supplierElement.textContent.trim() : 'Fornecedor';
                            const priceElement = card.querySelector('.text-primary, .fw-bold');
                            const priceText = priceElement ? priceElement.textContent.replace(/[^\d,]/g, '').replace(',', '.') : '100';
                            const price = parseFloat(priceText) || 100;
                            
                            const leadData = {
                                id: 'lead_' + Date.now(),
                                name: leadName,
                                supplier: supplier,
                                price: price,
                                temperature: 'quente'
                            };
                            
                            addToCart(leadData);
                        }
                    });
                }
            });
        }, 1000);
    }
}); 