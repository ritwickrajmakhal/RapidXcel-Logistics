from flask import (
    Blueprint, request, jsonify
)
from rapidxcel_logistics.models import Order
from rapidxcel_logistics import db
from .utils import not_found_error, validation_error, internal_server_error

bp = Blueprint('order', __name__)

# Function to calculate shipping cost
def calculate_shipping_cost(weight):
    base_cost = 5.0  # Base cost for shipping
    cost_per_kg = 2.0  # Cost per kilogram
    return base_cost + (cost_per_kg * weight)

# Create an order (POST)
@bp.route('/api/orders', methods=['POST'])
def create_order():
    data = request.get_json()  # Get the JSON data from the request
    
    if not data:
        return validation_error('Request payload is missing')
    
    # Validate required fields
    required_fields = ['customer_id', 'shipping_address', 'consignment_weight']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return validation_error(f'Missing required fields: {", ".join(missing_fields)}')

    try:
        new_order = Order(
            customer_id=data['customer_id'],
            shipping_address=data['shipping_address'],
            consignment_weight=data['consignment_weight'],
            shipping_cost=calculate_shipping_cost(data['consignment_weight'])  # Calculate shipping cost
        )
        db.session.add(new_order)
        db.session.commit()
        return jsonify({'message': 'Order created successfully', 'order_id': new_order.id}), 201
    except Exception as e:
        db.session.rollback()
        return internal_server_error(str(e))

# Retrieve all orders (GET)
@bp.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()  # Query all orders
    return jsonify([order.to_dict() for order in orders]), 200

# Retrieve a specific order (GET)
@bp.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get(order_id)  # Query the order by ID
    if order:
        return jsonify(order.to_dict()), 200
    return not_found_error('Order')

# Update an order (PUT)
@bp.route('/api/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    order = Order.query.get(order_id)  # Query the order by ID
    if not order:
        return not_found_error('Order')

    data = request.get_json()  # Get the JSON data from the request
    if not data:
        return validation_error('Request payload is missing')

    # Update the order attributes dynamically
    for key, value in data.items():
        if hasattr(order, key):
            setattr(order, key, value)

    # Recalculate shipping cost if consignment_weight is updated
    if 'consignment_weight' in data:
        order.shipping_cost = calculate_shipping_cost(order.consignment_weight)

    try:
        db.session.commit()
        return jsonify({'message': 'Order updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return internal_server_error(str(e))

# Delete an order (DELETE)
@bp.route('/api/orders/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = Order.query.get(order_id)  # Query the order by ID
    if not order:
        return not_found_error('Order')

    try:
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return internal_server_error(str(e))