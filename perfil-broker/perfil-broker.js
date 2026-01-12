document.addEventListener('DOMContentLoaded', function() {
    const btnAdicionarProduto = document.getElementById('btnAdicionarProduto');
    const tagsProdutos = document.getElementById('tagsProdutos');
    
    function adicionarBotaoRemover(tag) {
        if (tag.querySelector('.tag-remove')) {
            return;
        }
        
        let spanTexto = tag.querySelector('span:not(.tag-remove)');
        if (!spanTexto) {
            const textoOriginal = tag.textContent.trim();
            tag.textContent = '';
            spanTexto = document.createElement('span');
            spanTexto.textContent = textoOriginal;
            tag.appendChild(spanTexto);
        }
        
        const btnRemover = document.createElement('button');
        btnRemover.type = 'button';
        btnRemover.className = 'tag-remove';
        btnRemover.innerHTML = '&times;';
        btnRemover.setAttribute('aria-label', 'Remover');
        
        btnRemover.addEventListener('click', function(e) {
            e.stopPropagation();
            tag.remove();
        });
        
        tag.appendChild(btnRemover);
    }
    
    if (tagsProdutos) {
        const tagsExistentes = tagsProdutos.querySelectorAll('.tag-product');
        tagsExistentes.forEach(tag => {
            adicionarBotaoRemover(tag);
        });
    }
    
    const modalAdicionarProduto = document.getElementById('modalAdicionarProduto');
    const inputNomeProduto = document.getElementById('inputNomeProduto');
    const btnConfirmarProduto = document.getElementById('btnConfirmarProduto');
    
    if (btnAdicionarProduto && modalAdicionarProduto) {
        btnAdicionarProduto.addEventListener('click', function() {
            const modal = new bootstrap.Modal(modalAdicionarProduto);
            if (inputNomeProduto) {
                inputNomeProduto.value = '';
            }
            modal.show();
        });
    }
    
    if (btnConfirmarProduto && inputNomeProduto && tagsProdutos) {
        btnConfirmarProduto.addEventListener('click', function() {
            const nomeProduto = inputNomeProduto.value.trim();
            if (nomeProduto !== '') {
                const tag = document.createElement('span');
                tag.className = 'tag-product';
                const spanTexto = document.createElement('span');
                spanTexto.textContent = nomeProduto;
                tag.appendChild(spanTexto);
                adicionarBotaoRemover(tag);
                tagsProdutos.appendChild(tag);
                
                const modal = bootstrap.Modal.getInstance(modalAdicionarProduto);
                if (modal) {
                    modal.hide();
                }
                inputNomeProduto.value = '';
            }
        });
    }
    
    if (inputNomeProduto) {
        inputNomeProduto.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (btnConfirmarProduto) {
                    btnConfirmarProduto.click();
                }
            }
        });
    }

    const formPerfilBroker = document.getElementById('formPerfilBroker');
    if (formPerfilBroker) {
        formPerfilBroker.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (tagsProdutos) {
                const produtos = Array.from(tagsProdutos.querySelectorAll('.tag-product')).map(tag => {
                    const spanTexto = tag.querySelector('span');
                    return spanTexto ? spanTexto.textContent.trim() : tag.textContent.replace('×', '').trim();
                });
                
                console.log('Dados do formulário:', {
                    produtos: produtos
                });
            }
        });
    }

    const radioOptions = document.querySelectorAll('.radio-option');
    radioOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                radioOptions.forEach(opt => {
                    opt.querySelector('.radio-option-card').classList.remove('radio-option-card-active');
                });
                this.querySelector('.radio-option-card').classList.add('radio-option-card-active');
            }
        });
    });

    const inputFotoPerfil = document.getElementById('inputFotoPerfil');
    const uploadPhotoDropzone = document.getElementById('uploadPhotoDropzone');
    const uploadPhotoPreview = document.getElementById('uploadPhotoPreview');
    const btnRemovePhoto = document.getElementById('btnRemovePhoto');

    if (inputFotoPerfil && uploadPhotoDropzone && uploadPhotoPreview && btnRemovePhoto) {
        function handleFile(file) {
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadPhotoPreview.src = e.target.result;
                    uploadPhotoPreview.style.display = 'block';
                    uploadPhotoDropzone.classList.add('has-preview');
                    const content = uploadPhotoDropzone.querySelector('.upload-photo-content');
                    if (content) {
                        content.style.display = 'none';
                    }
                    btnRemovePhoto.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        }

        uploadPhotoDropzone.addEventListener('click', function() {
            inputFotoPerfil.click();
        });

        inputFotoPerfil.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        });

        uploadPhotoDropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('drag-over');
        });

        uploadPhotoDropzone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
        });

        uploadPhotoDropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
                inputFotoPerfil.files = e.dataTransfer.files;
            }
        });

        btnRemovePhoto.addEventListener('click', function(e) {
            e.stopPropagation();
            inputFotoPerfil.value = '';
            uploadPhotoPreview.src = '';
            uploadPhotoPreview.style.display = 'none';
            uploadPhotoDropzone.classList.remove('has-preview');
            const content = uploadPhotoDropzone.querySelector('.upload-photo-content');
            if (content) {
                content.style.display = 'flex';
            }
            btnRemovePhoto.style.display = 'none';
        });
    }
});

