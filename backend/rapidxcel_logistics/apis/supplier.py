from flask import Blueprint, request, jsonify
from rapidxcel_logistics.models import User
from rapidxcel_logistics import db
from .utils import not_found_error, validation_error, internal_server_error, role_required
from flask_login import login_required
from werkzeug.security import generate_password_hash

supplier_bp = Blueprint('supplier', __name__)
#feature-1 supplier management

# to add a new supplier
@supplier_bp.route('/api/suppliers', methods=['POST'])
@login_required
@role_required('Inventory Manager')
def add_supplier():
    data = request.get_json()
    if not data:
        return validation_error('Request payload is missing')

    # Validate required fields
    required_fields = ['name', 'email', 'password', 'phone_number', 'address']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return validation_error(f'Missing required fields: {", ".join(missing_fields)}')
    
    hashed_password = generate_password_hash(data['password'])
    new_supplier = User(
        role='Supplier',
        name=data['name'],
        email=data['email'],
        password_hash=hashed_password,
        phone_number=data['phone_number'],
        address=data['address']
    )
    try:
        db.session.add(new_supplier)
        db.session.commit()
        return jsonify({"message": "Supplier added successfully", "supplier": new_supplier.to_dict()}), 201
    except Exception as e:
        return internal_server_error(str(e))

# to get all suppliers
@supplier_bp.route('/api/suppliers', methods=['GET'])
@login_required
@role_required('Inventory Manager')
def get_suppliers():
    suppliers = User.query.filter_by(role='Supplier').all()
    return jsonify([supplier.to_dict() for supplier in suppliers]), 200

# to get a supplier
@supplier_bp.route('/api/suppliers/<int:supplier_id>', methods=['GET'])
@login_required
@role_required('Inventory Manager')
def get_supplier(supplier_id):
    supplier = User.query.get(supplier_id)

    if not supplier:
        return not_found_error('Supplier')

    return jsonify(supplier.to_dict()), 200

# to update a supplier
@supplier_bp.route('/api/suppliers/<int:supplier_id>', methods=['PUT'])
@login_required
@role_required('Inventory Manager')
def update_supplier(supplier_id):
    data = request.get_json()
    if not data:
        return validation_error('Request payload is missing')
    
    supplier = User.query.get(supplier_id)

    if not supplier:
        return not_found_error('Supplier')

    try:
        supplier.name = data.get('name', supplier.name)
        supplier.email = data.get('email', supplier.email)
        supplier.phone_number = data.get('phone_number', supplier.phone_number)
        supplier.address = data.get('address', supplier.address)

        db.session.commit()
        return jsonify({"message": "Supplier updated successfully", "supplier": supplier.to_dict()}), 200
    except Exception as e:
        return internal_server_error(str(e))

# to delete a supplier
@supplier_bp.route('/api/suppliers/<int:supplier_id>', methods=['DELETE'])
@login_required
@role_required('Inventory Manager')
def delete_supplier(supplier_id):
    supplier = User.query.get(supplier_id)

    if not supplier:
        return not_found_error('Supplier')

    db.session.delete(supplier)
    db.session.commit()
    return jsonify({"message": "Supplier deleted successfully"}), 200