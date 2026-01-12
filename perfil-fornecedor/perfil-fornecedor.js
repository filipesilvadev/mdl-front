document.addEventListener('DOMContentLoaded', function() {
    const linkAlterarAvatar = document.getElementById('linkAlterarAvatar');
    const avatarProfileWrapper = document.getElementById('avatarProfileWrapper');
    const modalAlterarAvatar = document.getElementById('modalAlterarAvatar');
    const uploadAvatarDropzone = document.getElementById('uploadAvatarDropzone');
    const inputAvatarUpload = document.getElementById('inputAvatarUpload');
    const uploadAvatarContent = document.getElementById('uploadAvatarContent');
    const uploadAvatarPreview = document.getElementById('uploadAvatarPreview');
    const btnConfirmarAvatar = document.getElementById('btnConfirmarAvatar');
    const avatarProfile = document.getElementById('avatarProfile');
    
    let selectedFile = null;

    function openModal() {
        if (modalAlterarAvatar) {
            const modal = new bootstrap.Modal(modalAlterarAvatar);
            modal.show();
            
            uploadAvatarDropzone.classList.remove('has-preview', 'drag-over');
            uploadAvatarContent.style.display = 'flex';
            uploadAvatarPreview.style.display = 'none';
            btnConfirmarAvatar.disabled = true;
            selectedFile = null;
            if (inputAvatarUpload) {
                inputAvatarUpload.value = '';
            }
        }
    }

    if (linkAlterarAvatar && avatarProfileWrapper) {
        linkAlterarAvatar.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });

        avatarProfileWrapper.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    }

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                alert('O arquivo é muito grande. Por favor, selecione uma imagem de até 5MB.');
                return;
            }
            
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadAvatarPreview.src = e.target.result;
                uploadAvatarPreview.style.display = 'block';
                uploadAvatarContent.style.display = 'none';
                uploadAvatarDropzone.classList.add('has-preview');
                btnConfirmarAvatar.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione um arquivo de imagem válido (JPG, PNG ou GIF).');
        }
    }

    if (uploadAvatarDropzone && inputAvatarUpload) {
        uploadAvatarDropzone.addEventListener('click', function() {
            inputAvatarUpload.click();
        });

        inputAvatarUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
            }
        });

        uploadAvatarDropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('drag-over');
        });

        uploadAvatarDropzone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
        });

        uploadAvatarDropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
            
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
                inputAvatarUpload.files = e.dataTransfer.files;
            }
        });
    }

    if (btnConfirmarAvatar && avatarProfile) {
        btnConfirmarAvatar.addEventListener('click', function() {
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = avatarProfile.querySelector('img');
                    if (img) {
                        img.src = e.target.result;
                    } else {
                        const newImg = document.createElement('img');
                        newImg.src = e.target.result;
                        newImg.alt = 'Avatar';
                        avatarProfile.innerHTML = '';
                        avatarProfile.appendChild(newImg);
                    }
                    
                    const modal = bootstrap.Modal.getInstance(modalAlterarAvatar);
                    if (modal) {
                        modal.hide();
                    }
                };
                reader.readAsDataURL(selectedFile);
            }
        });
    }

    const formPerfilFornecedor = document.getElementById('formPerfilFornecedor');
    if (formPerfilFornecedor) {
        formPerfilFornecedor.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Formulário submetido');
        });
    }

    const btnEditFields = document.querySelectorAll('.btn-edit-field');
    btnEditFields.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.closest('.input-group-profile').querySelector('.form-control-profile');
            if (input && !input.hasAttribute('readonly')) {
                input.focus();
                input.select();
            }
        });
    });

    const btnDocumentView = document.querySelectorAll('.btn-document-view');
    btnDocumentView.forEach(btn => {
        btn.addEventListener('click', function() {
            const documentCard = this.closest('.document-card');
            const documentName = documentCard.querySelector('.document-name').textContent;
            console.log('Visualizar documento:', documentName);
        });
    });

    const btnDocumentDelete = document.querySelectorAll('.btn-document-delete');
    btnDocumentDelete.forEach(btn => {
        btn.addEventListener('click', function() {
            const documentCard = this.closest('.document-card');
            const documentName = documentCard.querySelector('.document-name').textContent;
            
            if (confirm('Tem certeza que deseja excluir o documento "' + documentName + '"?')) {
                documentCard.remove();
            }
        });
    });

    const btnEnviarDocumento = document.getElementById('btnEnviarDocumento');
    const modalEnviarDocumento = document.getElementById('modalEnviarDocumento');
    const uploadDocumentDropzone = document.getElementById('uploadDocumentDropzone');
    const inputDocumentUpload = document.getElementById('inputDocumentUpload');
    const uploadDocumentContent = document.getElementById('uploadDocumentContent');
    const uploadedDocumentsList = document.getElementById('uploadedDocumentsList');
    const uploadedDocumentsContainer = document.getElementById('uploadedDocumentsContainer');
    const btnConfirmarDocumentos = document.getElementById('btnConfirmarDocumentos');
    const documentosList = document.getElementById('documentosList');
    
    let selectedDocuments = [];

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function getFileIcon(fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') {
            return '<i class="ki-duotone ki-file"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>';
        }
        return '<i class="ki-duotone ki-picture"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>';
    }

    function renderUploadedDocuments() {
        if (selectedDocuments.length === 0) {
            uploadedDocumentsList.style.display = 'none';
            btnConfirmarDocumentos.disabled = true;
            return;
        }

        uploadedDocumentsList.style.display = 'block';
        btnConfirmarDocumentos.disabled = false;
        
        uploadedDocumentsContainer.innerHTML = '';
        selectedDocuments.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'uploaded-document-item';
            item.innerHTML = `
                <div class="uploaded-document-icon">${getFileIcon(file.name)}</div>
                <div class="uploaded-document-info">
                    <div class="uploaded-document-name">${file.name}</div>
                    <div class="uploaded-document-size">${formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="uploaded-document-remove" data-index="${index}">
                    <i class="ki-duotone ki-cross">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                </button>
            `;
            uploadedDocumentsContainer.appendChild(item);
        });

        uploadedDocumentsContainer.querySelectorAll('.uploaded-document-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                selectedDocuments.splice(index, 1);
                renderUploadedDocuments();
            });
        });
    }

    function openModalDocumentos() {
        if (modalEnviarDocumento) {
            const modal = new bootstrap.Modal(modalEnviarDocumento);
            modal.show();
            
            selectedDocuments = [];
            uploadDocumentContent.style.display = 'flex';
            uploadedDocumentsList.style.display = 'none';
            btnConfirmarDocumentos.disabled = true;
            if (inputDocumentUpload) {
                inputDocumentUpload.value = '';
            }
        }
    }

    if (btnEnviarDocumento) {
        btnEnviarDocumento.addEventListener('click', function() {
            openModalDocumentos();
        });
    }

    function handleFiles(files) {
        const validFiles = Array.from(files).filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            const maxSize = 10 * 1024 * 1024;
            
            if (!validTypes.includes(file.type)) {
                alert('Arquivo "' + file.name + '" não é um formato válido. Apenas PDF, JPG, PNG e GIF são aceitos.');
                return false;
            }
            
            if (file.size > maxSize) {
                alert('Arquivo "' + file.name + '" é muito grande. O tamanho máximo é 10MB.');
                return false;
            }
            
            return true;
        });

        selectedDocuments = [...selectedDocuments, ...validFiles];
        renderUploadedDocuments();
    }

    if (uploadDocumentDropzone && inputDocumentUpload) {
        uploadDocumentDropzone.addEventListener('click', function() {
            inputDocumentUpload.click();
        });

        inputDocumentUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
            }
        });

        uploadDocumentDropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.add('drag-over');
        });

        uploadDocumentDropzone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
        });

        uploadDocumentDropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
            }
        });
    }

    if (btnConfirmarDocumentos && documentosList) {
        btnConfirmarDocumentos.addEventListener('click', function() {
            if (selectedDocuments.length > 0) {
                selectedDocuments.forEach((file, index) => {
                    const today = new Date();
                    const dateStr = today.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const colDiv = document.createElement('div');
                        colDiv.className = 'col-12 col-lg-6';
                        colDiv.innerHTML = `
                            <div class="document-card">
                                <div class="document-icon">
                                    ${getFileIcon(file.name)}
                                </div>
                                <div class="document-info">
                                    <div class="document-name">${file.name}</div>
                                    <div class="document-date">${dateStr}</div>
                                </div>
                                <div class="document-status">
                                    <span class="badge-aprovado">
                                        <i class="ki-duotone ki-check-circle">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                        Aprovado
                                    </span>
                                </div>
                                <div class="document-actions">
                                    <button type="button" class="btn-document-action btn-document-view" title="Visualizar">
                                        <i class="ki-duotone ki-eye">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                            <span class="path3"></span>
                                        </i>
                                    </button>
                                    <button type="button" class="btn-document-action btn-document-delete" title="Excluir">
                                        <i class="ki-duotone ki-trash">
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
                        documentosList.appendChild(colDiv);

                        const newViewBtn = colDiv.querySelector('.btn-document-view');
                        const newDeleteBtn = colDiv.querySelector('.btn-document-delete');
                        
                        if (newViewBtn) {
                            newViewBtn.addEventListener('click', function() {
                                const documentCard = this.closest('.document-card');
                                const documentName = documentCard.querySelector('.document-name').textContent;
                                console.log('Visualizar documento:', documentName);
                            });
                        }
                        
                        if (newDeleteBtn) {
                            newDeleteBtn.addEventListener('click', function() {
                                const documentCard = this.closest('.document-card');
                                const documentName = documentCard.querySelector('.document-name').textContent;
                                if (confirm('Tem certeza que deseja excluir o documento "' + documentName + '"?')) {
                                    documentCard.closest('.col-12').remove();
                                }
                            });
                        }
                    };
                    reader.readAsDataURL(file);
                });

                const modal = bootstrap.Modal.getInstance(modalEnviarDocumento);
                if (modal) {
                    modal.hide();
                }
                
                selectedDocuments = [];
            }
        });
    }
});

