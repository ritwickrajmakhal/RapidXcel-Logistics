from flask import jsonify

def not_found_error(entity_name):
    return jsonify({'error': f'{entity_name} not found'}), 404

def validation_error(message):
    return jsonify({'error': message}), 400

def internal_server_error(message):
    return jsonify({'error': 'Internal Server Error', 'message': message}), 500