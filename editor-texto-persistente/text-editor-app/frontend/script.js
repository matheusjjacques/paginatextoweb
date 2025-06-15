document.addEventListener('DOMContentLoaded', function() {
    const textEditor = document.getElementById('textEditor');
    const lineCount = document.getElementById('lineCount');
    const charCount = document.getElementById('charCount');
    const wordCount = document.getElementById('wordCount');
    const lineNumbers = document.getElementById('lineNumbers');
    const lastUpdate = document.getElementById('lastUpdate');
    const statusMessage = document.getElementById('statusMessage');
    
    const loadBtn = document.getElementById('loadBtn');
    const saveBtn = document.getElementById('saveBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const toggleViewBtn = document.getElementById('toggleViewBtn');
    
    const savedContentSection = document.getElementById('savedContentSection');
    const savedContent = document.getElementById('savedContent');

    const MAX_LINES = 4000;
    const API_BASE = '/api';

    // Função para mostrar notificações
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Função para atualizar status
    function updateStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        if (type !== 'loading') {
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }, 5000);
        }
    }

    // Função para atualizar estatísticas
    function updateStats() {
        const text = textEditor.value;
        const lines = text.split('\n');
        const chars = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

        lineCount.textContent = `Linhas: ${lines.length}`;
        charCount.textContent = `Caracteres: ${chars}`;
        wordCount.textContent = `Palavras: ${words}`;

        updateLineNumbers(lines.length);

        if (lines.length > MAX_LINES) {
            lineCount.style.color = '#ef4444';
            const truncatedLines = lines.slice(0, MAX_LINES);
            textEditor.value = truncatedLines.join('\n');
            showNotification(`Limite de ${MAX_LINES} linhas excedido. O texto foi truncado.`, 'warning');
        } else {
            lineCount.style.color = '#64748b';
        }

        lastUpdate.textContent = new Date().toLocaleString('pt-BR');
    }

    // Função para atualizar numeração das linhas
    function updateLineNumbers(totalLines) {
        let numbers = '';
        for (let i = 1; i <= Math.max(totalLines, 1); i++) {
            numbers += i + '\n';
        }
        lineNumbers.textContent = numbers;
    }

    // Função para sincronizar scroll
    function syncScroll() {
        lineNumbers.scrollTop = textEditor.scrollTop;
    }

    // Função para carregar texto do servidor
    async function loadText() {
        try {
            updateStatus('Carregando texto...', 'loading');
            loadBtn.disabled = true;

            const response = await fetch(`${API_BASE}/text`);
            const data = await response.json();

            if (response.ok) {
                if (data.text) {
                    textEditor.value = data.text;
                    updateStats();
                    showSavedContent(data.text);
                    updateStatus('Texto carregado com sucesso!', 'success');
                    showNotification('Texto carregado com sucesso!', 'success');
                } else {
                    updateStatus('Nenhum texto salvo encontrado.', 'error');
                    showNotification('Nenhum texto salvo encontrado.', 'warning');
                }
            } else {
                throw new Error(data.error || 'Erro ao carregar texto');
            }
        } catch (error) {
            console.error('Erro ao carregar texto:', error);
            updateStatus('Erro ao carregar texto.', 'error');
            showNotification('Erro ao carregar texto.', 'error');
        } finally {
            loadBtn.disabled = false;
        }
    }

    // Função para salvar texto no servidor
    async function saveText() {
        const text = textEditor.value.trim();
        
        if (!text) {
            showNotification('Não há texto para salvar.', 'warning');
            return;
        }

        try {
            updateStatus('Salvando texto...', 'loading');
            saveBtn.disabled = true;

            const response = await fetch(`${API_BASE}/text`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (response.ok) {
                showSavedContent(text);
                updateStatus('Texto salvo com sucesso!', 'success');
                showNotification('Texto salvo com sucesso!', 'success');
            } else {
                throw new Error(data.error || 'Erro ao salvar texto');
            }
        } catch (error) {
            console.error('Erro ao salvar texto:', error);
            updateStatus('Erro ao salvar texto.', 'error');
            showNotification('Erro ao salvar texto.', 'error');
        } finally {
            saveBtn.disabled = false;
        }
    }

    // Função para mostrar conteúdo salvo
    function showSavedContent(text) {
        savedContent.textContent = text;
        savedContentSection.style.display = 'block';
        savedContentSection.classList.add('show');
    }

    // Event listeners
    textEditor.addEventListener('input', updateStats);
    textEditor.addEventListener('scroll', syncScroll);

    // Botões
    loadBtn.addEventListener('click', loadText);
    saveBtn.addEventListener('click', saveText);

    clearBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja limpar todo o texto do editor?')) {
            textEditor.value = '';
            updateStats();
            textEditor.focus();
        }
    });

    copyBtn.addEventListener('click', function() {
        textEditor.select();
        textEditor.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            showNotification('Texto copiado para a área de transferência!', 'success');
        } catch (err) {
            navigator.clipboard.writeText(textEditor.value).then(function() {
                showNotification('Texto copiado para a área de transferência!', 'success');
            }).catch(function() {
                showNotification('Erro ao copiar texto', 'error');
            });
        }
    });

    toggleViewBtn.addEventListener('click', function() {
        const content = savedContentSection.querySelector('.saved-content');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggleViewBtn.textContent = '👁️ Ocultar';
        } else {
            content.style.display = 'none';
            toggleViewBtn.textContent = '👁️ Mostrar';
        }
    });

    // Atalhos de teclado
    textEditor.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveText();
        }
        
        if (e.ctrlKey && e.key === 'o') {
            e.preventDefault();
            loadText();
        }
        
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            textEditor.select();
        }
    });

    // Suporte para arrastar e soltar arquivos
    textEditor.addEventListener('dragover', function(e) {
        e.preventDefault();
        textEditor.style.backgroundColor = '#f0f9ff';
    });

    textEditor.addEventListener('dragleave', function(e) {
        e.preventDefault();
        textEditor.style.backgroundColor = 'transparent';
    });

    textEditor.addEventListener('drop', function(e) {
        e.preventDefault();
        textEditor.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    textEditor.value = e.target.result;
                    updateStats();
                    showNotification('Arquivo carregado com sucesso!', 'success');
                };
                reader.readAsText(file);
            } else {
                showNotification('Por favor, arraste apenas arquivos de texto (.txt)', 'warning');
            }
        }
    });

    // Inicializar
    updateStats();
    textEditor.focus();
    
    // Carregar texto salvo automaticamente
    loadText();
});

