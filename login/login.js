document.addEventListener('DOMContentLoaded', function() {
    const roleButtons = document.querySelectorAll('.role-btn');
    const roleSelector = document.getElementById('roleSelector');
    const loginForm = document.getElementById('loginForm');

    roleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.dataset.role;
            roleButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (roleSelector) {
                roleSelector.setAttribute('data-active', role);
            }
        });
    });

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('senha').value;
            const role = document.querySelector('.role-btn.active').dataset.role;
            const lembrar = document.getElementById('lembrar').checked;

            console.log('Login attempt:', {
                usuario,
                role,
                lembrar
            });

        });
    }
});

