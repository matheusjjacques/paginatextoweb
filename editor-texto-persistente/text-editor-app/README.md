# 📝 Editor de Texto Persistente

Uma aplicação web completa para edição, salvamento e compartilhamento de textos com até 4.000 linhas. Desenvolvida com Flask (backend) e HTML/CSS/JavaScript (frontend).

## ✨ Funcionalidades

- **Editor de texto avançado** com numeração de linhas
- **Salvamento persistente** no servidor
- **Carregamento automático** do texto salvo
- **Contagem em tempo real** de linhas, caracteres e palavras
- **Interface responsiva** e moderna
- **Visualização pública** do texto salvo
- **Suporte a arrastar e soltar** arquivos de texto
- **Atalhos de teclado** (Ctrl+S para salvar, Ctrl+O para carregar)
- **Limite de 4.000 linhas** com validação automática

## 🚀 Como Usar

### Instalação Local

1. **Clone ou baixe** este projeto
2. **Navegue** até o diretório do projeto:
   ```bash
   cd text-editor-app
   ```

3. **Execute o script de inicialização**:
   ```bash
   ./start.sh
   ```
   
   Ou manualmente:
   ```bash
   cd backend
   pip3 install -r requirements.txt
   python3 app.py
   ```

4. **Acesse** a aplicação em: `http://localhost:5000`

### Uso da Interface

1. **Digite ou cole** seu texto no editor
2. **Clique em "💾 Salvar"** para persistir o texto
3. **Use "📂 Carregar"** para recuperar o texto salvo
4. **O texto salvo** aparecerá na seção "📄 Texto Salvo" abaixo do editor
5. **Use "📋 Copiar"** para copiar todo o texto
6. **Use "🗑️ Limpar"** para limpar apenas o editor (não remove o texto salvo)

## 🌐 Hospedagem Pública

Para tornar sua aplicação acessível publicamente (para humanos e IAs como ChatGPT), você pode hospedá-la em:

### Opção 1: Render (Recomendado)

1. **Crie uma conta** em [render.com](https://render.com)
2. **Conecte seu repositório** GitHub
3. **Configure o serviço**:
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && python app.py`
   - Environment: Python 3
4. **Deploy** e obtenha sua URL pública

### Opção 2: Railway

1. **Crie uma conta** em [railway.app](https://railway.app)
2. **Conecte seu repositório** GitHub
3. **Configure as variáveis**:
   - Start Command: `cd backend && python app.py`
4. **Deploy** automaticamente

### Opção 3: Heroku

1. **Crie uma conta** em [heroku.com](https://heroku.com)
2. **Instale o Heroku CLI**
3. **Crie um arquivo `Procfile`** na raiz:
   ```
   web: cd backend && python app.py
   ```
4. **Deploy** via Git

## 📁 Estrutura do Projeto

```
text-editor-app/
├── frontend/
│   ├── index.html          # Página principal
│   ├── styles.css          # Estilos CSS
│   └── script.js           # JavaScript do frontend
├── backend/
│   ├── app.py              # Aplicação Flask
│   ├── requirements.txt    # Dependências Python
│   └── saved_text.json     # Arquivo de dados (criado automaticamente)
├── start.sh                # Script de inicialização
└── README.md               # Este arquivo
```

## 🔧 Tecnologias Utilizadas

- **Backend**: Flask, Flask-CORS
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Armazenamento**: JSON (arquivo local)
- **Estilo**: CSS Grid, Flexbox, Gradientes
- **Fontes**: Inter (Google Fonts), Monaco (monospace)

## 🎨 Características da Interface

- **Design moderno** com gradiente roxo/azul
- **Numeração de linhas** sincronizada
- **Notificações visuais** para ações
- **Responsivo** para desktop e mobile
- **Animações suaves** e micro-interações
- **Scrollbar personalizada**
- **Tema profissional** e acessível

## 🔒 Segurança e Privacidade

- **CORS habilitado** para acesso público
- **Validação de entrada** no backend
- **Limite de tamanho** para prevenir abuso
- **Tratamento de erros** robusto
- **Logs de acesso** no servidor

## 📊 Limitações

- **Máximo de 4.000 linhas** por texto
- **Um texto salvo** por instância
- **Armazenamento local** (não distribuído)
- **Sem autenticação** (acesso público)

## 🆘 Solução de Problemas

### Erro de Porta em Uso
```bash
# Encontrar processo usando a porta 5000
lsof -i :5000
# Matar o processo
kill -9 <PID>
```

### Dependências Não Instaladas
```bash
# Instalar manualmente
pip3 install flask flask-cors
```

### Permissão Negada no Script
```bash
# Tornar executável
chmod +x start.sh
```

## 🤝 Contribuição

Este projeto foi desenvolvido pelo **Manus AI** para atender às necessidades específicas de edição e compartilhamento de texto com persistência.

## 📄 Licença

Projeto de uso livre para fins educacionais e pessoais.

---

**Desenvolvido com ❤️ pelo Manus AI**

