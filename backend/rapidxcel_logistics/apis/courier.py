from flask import (
    Blueprint, request, jsonify
)
from werkzeug.exceptions import abort
from rapidxcel_logistics.models import Courier
from rapidxcel_logistics import db
from .utils import not_found_error, validation_error, internal_server_error

bp = Blueprint('courier', __name__)

# Get all couriers
@bp.route('/api/couriers', methods=['GET'])
def get_couriers():
    couriers = Courier.query.all()
    return jsonify({'couriers': [courier.to_dict() for courier in couriers]}), 200

# Get a single courier by ID
@bp.route('/api/couriers/<int:id>', methods=['GET'])
def get_courier(id):
    courier = Courier.query.get(id)
    if courier is None:
        return not_found_error('Courier')
    return jsonify(courier.to_dict()), 200

# Create a new courier
@bp.route('/api/couriers', methods=['POST'])
def create_courier():
    data = request.get_json()

    if not data:
        return validation_error('Request payload is missing')

    # Validate required fields
    required_fields = ['order_id', 'courier_id', 'status', 'name', 'phone_number', 'email', 'address']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return validation_error(f'Missing required fields: {", ".join(missing_fields)}')

    # Create and save the new courier
    try:
        courier = Courier(**data)
        db.session.add(courier)
        db.session.commit()
        return jsonify(courier.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return internal_server_error(str(e))

# Update a courier by ID
@bp.route('/api/couriers/<int:id>', methods=['PUT'])
def update_courier(id):
    courier = Courier.query.get(id)
    if courier is None:
        return not_found_error('Courier')

    data = request.get_json()
    if not data:
        return validation_error('Request payload is missing')

    # Update the courier fields if provided
    for key, value in data.items():
        if hasattr(courier, key):
            setattr(courier, key, value)
        else:
            return validation_error(f'Invalid field: {key}')

    try:
        db.session.commit()
        return jsonify(courier.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return internal_server_error(str(e))

# Delete a courier by ID
@bp.route('/api/couriers/<int:id>', methods=['DELETE'])
def delete_courier(id):
    courier = Courier.query.get(id)
    if courier is None:
        return not_found_error('Courier')

    try:
        db.session.delete(courier)
        db.session.commit()
        return jsonify({'message': 'Courier deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return internal_server_error(str(e))