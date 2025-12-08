document.addEventListener('DOMContentLoaded', function () {
    var inputBuscaFornecedor = document.getElementById('filtroBuscaFornecedor');
    var containerFornecedores = document.getElementById('containerFornecedores');
    var cardsFornecedores = containerFornecedores ? Array.from(containerFornecedores.querySelectorAll('.fornecedor-card')) : [];
    var mensagemSemResultados = document.getElementById('mensagemSemResultados');

    function aplicarBusca() {
        var texto = (inputBuscaFornecedor && inputBuscaFornecedor.value || '').toLowerCase().trim();
        var visiveis = 0;

        cardsFornecedores.forEach(function (card) {
            var textoCard = card.textContent.toLowerCase();
            var visivel = !texto || textoCard.indexOf(texto) !== -1;

            card.classList.toggle('d-none', !visivel);
            if (visivel) visiveis++;
        });

        if (mensagemSemResultados) {
            mensagemSemResultados.classList.toggle('d-none', visiveis > 0);
        }
    }

    if (inputBuscaFornecedor) {
        inputBuscaFornecedor.addEventListener('input', aplicarBusca);
        inputBuscaFornecedor.addEventListener('keyup', function (event) {
            if (event.key === 'Enter') {
                aplicarBusca();
            }
        });
    }

    var carrinho = JSON.parse(localStorage.getItem('mercadaoCarrinho') || '[]');
    var badgeCarrinho = document.getElementById('badgeCarrinho');
    if (badgeCarrinho) {
        var quantidade = carrinho.length;
        badgeCarrinho.textContent = quantidade;
        if (quantidade === 0) {
            badgeCarrinho.style.display = 'none';
        } else {
            badgeCarrinho.style.display = 'flex';
        }
    }
});







