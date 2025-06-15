#!/bin/bash

# Script para iniciar o Editor de Texto Persistente
# Autor: Manus AI

echo "🚀 Iniciando Editor de Texto Persistente..."
echo "=================================="

# Verificar se estamos no diretório correto
if [ ! -f "backend/app.py" ]; then
    echo "❌ Erro: Execute este script no diretório raiz do projeto (text-editor-app)"
    exit 1
fi

# Instalar dependências se necessário
echo "📦 Verificando dependências..."
cd backend
pip3 install -r requirements.txt

# Iniciar o servidor
echo "🌐 Iniciando servidor na porta 5000..."
echo "📝 Acesse: http://localhost:5000"
echo "🛑 Para parar o servidor, pressione Ctrl+C"
echo "=================================="

python3 app.py

