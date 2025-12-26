document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.role-btn');
    const tabSelector = document.getElementById('tabSelector');
    const cadastroForm = document.getElementById('cadastroForm');
    const userTypeRadios = document.querySelectorAll('input[name="userType"]');
    const userTypeCards = document.querySelectorAll('.user-type-card');

    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.tagName === 'A') {
                return;
            }
            e.preventDefault();
            const tab = this.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (tabSelector) {
                tabSelector.setAttribute('data-active', tab);
            }
        });
    });

    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            userTypeCards.forEach(card => card.classList.remove('active'));
            const selectedCard = this.closest('.user-type-option').querySelector('.user-type-card');
            if (selectedCard) {
                selectedCard.classList.add('active');
            }
        });
    });

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const ddd = document.getElementById('ddd').value;
            const celular = document.getElementById('celular').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            const termos = document.getElementById('termos').checked;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            if (!termos) {
                alert('Você precisa aceitar os Termos e Condições!');
                return;
            }

            const userType = document.querySelector('input[name="userType"]:checked').value;

            console.log('Cadastro attempt:', {
                nome,
                email,
                ddd,
                celular,
                userType,
                termos
            });

        });
    }
});

