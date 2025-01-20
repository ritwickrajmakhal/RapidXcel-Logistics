from flask import (
    Blueprint, request, jsonify
)
from rapidxcel_logistics.models import Order, OrderItem, Stock
from rapidxcel_logistics import db
from .utils import not_found_error, validation_error, internal_server_error, role_required
from flask_login import login_required
from datetime import datetime, timedelta

bp = Blueprint('order', __name__)

def calculate_shipping_cost(total_weight, location_type):
    if not total_weight or not location_type:
        raise ValueError('Missing required parameters')
            
    cost_per_kg = 2.0  # Cost per kilogram
    
    # Additional cost based on location
    location_cost = {
        'urban': 5.0,
        'suburban': 7.0,
        'rural': 10.0
    }
    
    if location_type not in location_cost:
        raise ValueError('Invalid location specified')
    
    shipping_cost = (cost_per_kg * total_weight) + location_cost[location_type]
    return shipping_cost

# API endpoint to calculate shipping cost
@bp.route('/api/orders/get-shipping-cost', methods=['GET'])
@login_required
@role_required('Customer')
def get_shipping_cost():
    total_weight = request.args.get('total_weight', type=float)
    location_type = request.args.get('location_type', type=str)
    
    try:
        shipping_cost = calculate_shipping_cost(total_weight, location_type)
        return jsonify({'shipping_cost': shipping_cost})
    except ValueError as e:
        return validation_error(str(e))

# Create an order (POST)
@bp.route('/api/orders', methods=['POST'])
@login_required
@role_required('Customer')
def create_order():
    data = request.get_json()  # Get the JSON data from the request
    
    if not data:
        return validation_error('Request payload is missing')
    
    # Validate required fields
    required_fields = ['customer_id', 'shipping_address', 'pin_code', 'phone_number', 'items', 'location_type']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return validation_error(f'Missing required fields: {", ".join(missing_fields)}')

    try:
        new_order = Order(
            customer_id=data['customer_id'],
            shipping_address=data['shipping_address'],
            pin_code=data['pin_code'],
            phone_number=data['phone_number'],
            consignment_weight=sum(item['weight'] for item in data['items']),  # Calculate total consignment weight
            shipping_cost=calculate_shipping_cost(sum(item['weight'] for item in data['items']), data['location_type']),
            delivery_date=datetime.now() + timedelta(days=3)
        )
        db.session.add(new_order)
        db.session.commit()

        # Add order items
        for item in data['items']:
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item['product_id'],
                quantity=item['quantity'],
                weight=item['weight'],
                price=item['price']
            )
            db.session.add(order_item)
            
            # reduce the quantity of the product in the stock
            product = Stock.query.get(item['product_id'])
            product.quantity -= int(item['quantity'])
            db.session.add(product)
        
        db.session.commit()
        return jsonify({'message': 'Order created successfully', 'order_id': new_order.id}), 201
    except Exception as e:
        db.session.rollback()
        return internal_server_error(str(e))

# Retrieve all orders (GET)
@bp.route('/api/orders', methods=['GET'])
@login_required
@role_required('Customer', 'Courier Service')
def get_orders():
    orders = Order.query.all()  # Query all orders
    return jsonify([order.to_dict() for order in orders]), 200

# Retrieve a specific order (GET)
@bp.route('/api/orders/<int:order_id>', methods=['GET'])
@login_required
@role_required('Customer')
def get_order(order_id):
    order = Order.query.get(order_id)  # Query the order by ID
    if order:
        return jsonify(order.to_dict()), 200
    return not_found_error('Order')

# Update an order (PUT)
@bp.route('/api/orders/<int:order_id>', methods=['PUT'])
@login_required
@role_required('Customer', 'Courier Service')
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
@login_required
@role_required('Customer')
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