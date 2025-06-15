from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Permitir requisições de qualquer origem

# Arquivo para armazenar o texto
DATA_FILE = 'saved_text.json'

def load_data():
    """Carrega os dados do arquivo JSON"""
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {}
    return {}

def save_data(data):
    """Salva os dados no arquivo JSON"""
    try:
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Erro ao salvar dados: {e}")
        return False

@app.route('/')
def index():
    """Serve a página principal"""
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve arquivos estáticos do frontend"""
    return send_from_directory('../frontend', filename)

@app.route('/api/text', methods=['GET'])
def get_text():
    """Retorna o texto salvo"""
    try:
        data = load_data()
        return jsonify({
            'text': data.get('text', ''),
            'last_updated': data.get('last_updated', None),
            'line_count': data.get('line_count', 0),
            'char_count': data.get('char_count', 0),
            'word_count': data.get('word_count', 0)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/text', methods=['POST'])
def save_text():
    """Salva o texto"""
    try:
        request_data = request.get_json()
        
        if not request_data or 'text' not in request_data:
            return jsonify({'error': 'Texto não fornecido'}), 400
        
        text = request_data['text']
        
        # Validar limite de linhas
        lines = text.split('\n')
        if len(lines) > 4000:
            return jsonify({'error': 'Texto excede o limite de 4.000 linhas'}), 400
        
        # Calcular estatísticas
        char_count = len(text)
        word_count = len(text.strip().split()) if text.strip() else 0
        
        # Preparar dados para salvar
        data = {
            'text': text,
            'last_updated': datetime.now().isoformat(),
            'line_count': len(lines),
            'char_count': char_count,
            'word_count': word_count
        }
        
        # Salvar dados
        if save_data(data):
            return jsonify({
                'message': 'Texto salvo com sucesso',
                'last_updated': data['last_updated'],
                'line_count': data['line_count'],
                'char_count': data['char_count'],
                'word_count': data['word_count']
            })
        else:
            return jsonify({'error': 'Erro ao salvar texto'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Retorna apenas as estatísticas do texto salvo"""
    try:
        data = load_data()
        return jsonify({
            'last_updated': data.get('last_updated', None),
            'line_count': data.get('line_count', 0),
            'char_count': data.get('char_count', 0),
            'word_count': data.get('word_count', 0),
            'has_text': bool(data.get('text', ''))
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint para verificar se o servidor está funcionando"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'message': 'Servidor funcionando corretamente'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint não encontrado'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    # Criar arquivo de dados se não existir
    if not os.path.exists(DATA_FILE):
        save_data({})
    
    # Executar servidor
    app.run(host='0.0.0.0', port=5000, debug=True)

