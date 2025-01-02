from flask import jsonify
from functools import wraps
from flask_login import current_user

def not_found_error(entity_name):
    return jsonify({'error': f'{entity_name} not found'}), 404

def validation_error(message):
    return jsonify({'error': message}), 400

def internal_server_error(message):
    return jsonify({'error': 'Internal Server Error', 'message': message}), 500

def role_required(required_role):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            if current_user.role != required_role:
                return jsonify({"error": "Forbidden", "message": "You don't have permission to access this resource"}), 403
            return func(*args, **kwargs)
        return wrapper
    return decorator