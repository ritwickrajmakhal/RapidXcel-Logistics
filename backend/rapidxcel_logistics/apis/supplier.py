from flask import Blueprint, request, jsonify
from rapidxcel_logistics.models import Supplier
from rapidxcel_logistics import db
from .utils import not_found_error, validation_error, internal_server_error

supplier_bp = Blueprint('supplier', __name__)
#feature-1 supplier management

# to add a new supplier
@supplier_bp.route('/api/suppliers', methods=['POST'])
def add_supplier():
    data = request.get_json()
    if not data:
        return validation_error('Invalid input')

    try:
        new_supplier = Supplier(
            name=data['name'],
            email=data['email'],
            phone_number=data['phone_number'],
            address=data['address']
        )
        db.session.add(new_supplier)
        db.session.commit()
        return jsonify({"message": "Supplier added successfully", "supplier": new_supplier.to_dict()}), 201
    except Exception as e:
        return internal_server_error(str(e))

# to get all suppliers
@supplier_bp.route('/api/suppliers', methods=['GET'])
def get_suppliers():
    suppliers = Supplier.query.all()
    return jsonify([supplier.to_dict() for supplier in suppliers]), 200

# to get a supplier
@supplier_bp.route('/api/suppliers/<int:supplier_id>', methods=['GET'])
def get_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)
    if supplier:
        return jsonify(supplier.to_dict()), 200
    return not_found_error('Supplier')

# to update a supplier
@supplier_bp.route('/api/suppliers/<int:supplier_id>', methods=['PUT'])
def update_supplier(supplier_id):
    data = request.get_json()
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return not_found_error('Supplier not found')

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
def delete_supplier(supplier_id):
    supplier = Supplier.query.get(supplier_id)

    if not supplier:
        return not_found_error('Supplier not found')

    db.session.delete(supplier)
    db.session.commit()
    return jsonify({"message": "Supplier deleted successfully"}), 200