// JavaScript para a tela de Contestar Lead

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const uploadDropzone = document.getElementById('uploadEvidenciasDropzone');
    const uploadContent = document.getElementById('uploadEvidenciasContent');
    const inputUpload = document.getElementById('inputEvidenciasUpload');
    const uploadedList = document.getElementById('uploadedEvidenciasList');
    const uploadedContainer = document.getElementById('uploadedEvidenciasContainer');
    const formContestacao = document.getElementById('formContestacao');
    
    // Array para armazenar os arquivos selecionados
    let selectedFiles = [];

    // Função para formatar tamanho do arquivo
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Função para obter ícone do arquivo
    function getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
            return '<i class="ki-duotone ki-picture fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>';
        } else if (extension === 'pdf') {
            return '<i class="ki-duotone ki-file fs-2"><span class="path1"></span><span class="path2"></span></i>';
        } else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
            return '<i class="ki-duotone ki-headphones fs-2"><span class="path1"></span><span class="path2"></span></i>';
        }
        return '<i class="ki-duotone ki-file fs-2"><span class="path1"></span><span class="path2"></span></i>';
    }

    // Função para renderizar arquivos enviados
    function renderUploadedFiles() {
        if (selectedFiles.length === 0) {
            uploadedList.style.display = 'none';
            uploadContent.style.display = 'flex';
            return;
        }

        uploadedList.style.display = 'block';
        uploadContent.style.display = 'none';
        uploadedContainer.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'uploaded-evidencia-item';
            item.innerHTML = `
                <div class="uploaded-evidencia-info">
                    <div class="uploaded-evidencia-icon">
                        ${getFileIcon(file.name)}
                    </div>
                    <div class="uploaded-evidencia-details">
                        <div class="uploaded-evidencia-name">${file.name}</div>
                        <div class="uploaded-evidencia-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="uploaded-evidencia-remove" data-index="${index}">
                    <i class="ki-duotone ki-cross fs-4">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                </button>
            `;
            uploadedContainer.appendChild(item);
        });

        // Adicionar eventos de remoção
        uploadedContainer.querySelectorAll('.uploaded-evidencia-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                selectedFiles.splice(index, 1);
                renderUploadedFiles();
            });
        });
    }

    // Validação de arquivos
    function validateFiles(files) {
        const validFiles = [];
        const maxSize = 10 * 1024 * 1024; // 10MB
        const validTypes = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf',
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'
        ];

        Array.from(files).forEach(file => {
            if (!validTypes.includes(file.type)) {
                alert(`O arquivo "${file.name}" não é um formato válido. Apenas imagens, PDFs e áudios são aceitos.`);
                return;
            }

            if (file.size > maxSize) {
                alert(`O arquivo "${file.name}" é muito grande. O tamanho máximo é 10MB.`);
                return;
            }

            validFiles.push(file);
        });

        return validFiles;
    }

    // Event listeners para upload
    if (uploadDropzone && inputUpload) {
        // Clique no dropzone
        uploadDropzone.addEventListener('click', function(e) {
            if (e.target.closest('.uploaded-evidencia-remove')) return;
            inputUpload.click();
        });

        // Mudança no input
        inputUpload.addEventListener('change', function(e) {
            const files = e.target.files;
            if (files.length > 0) {
                const validFiles = validateFiles(files);
                selectedFiles = [...selectedFiles, ...validFiles];
                renderUploadedFiles();
                inputUpload.value = '';
            }
        });

        // Drag and drop
        uploadDropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadDropzone.classList.add('drag-over');
        });

        uploadDropzone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadDropzone.classList.remove('drag-over');
        });

        uploadDropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadDropzone.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const validFiles = validateFiles(files);
                selectedFiles = [...selectedFiles, ...validFiles];
                renderUploadedFiles();
            }
        });
    }

    // Validação e envio do formulário
    if (formContestacao) {
        formContestacao.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validação básica
            const motivo = document.getElementById('motivoContestacao').value;
            const descricao = document.getElementById('descricaoProblema').value.trim();

            if (!motivo) {
                alert('Por favor, selecione um motivo para a contestação.');
                document.getElementById('motivoContestacao').focus();
                return;
            }

            if (!descricao) {
                alert('Por favor, descreva o problema detalhadamente.');
                document.getElementById('descricaoProblema').focus();
                return;
            }

            if (descricao.length < 20) {
                alert('A descrição do problema deve ter pelo menos 20 caracteres.');
                document.getElementById('descricaoProblema').focus();
                return;
            }

            // Aqui você pode adicionar a lógica de envio do formulário
            console.log('Formulário válido. Dados:', {
                motivo: motivo,
                descricao: descricao,
                observacoes: document.getElementById('observacoesComplementares').value,
                arquivos: selectedFiles.length
            });

            // Exemplo de envio (substitua pela sua lógica de API)
            // alert('Contestação enviada com sucesso!');
            // window.location.href = '../estoque-de-leads/estoque-de-leads.html';
        });
    }
});
