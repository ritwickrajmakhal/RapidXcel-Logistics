from flask import Blueprint, request, jsonify
from rapidxcel_logistics.models import db, Product, ReplenishmentOrder, ReplenishmentOrderItem
from datetime import datetime
from .utils import validation_error, not_found_error, internal_server_error, role_required
from flask_login import login_required


stock_replenishment_bp = Blueprint('stock_replenishment', __name__)

# Get all products
@stock_replenishment_bp.route('/api/stock-replenishment/products', methods=['GET'])
@login_required
@role_required('Supplier', 'Inventory Manager')
def get_products():
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products]), 200


# to add products
@stock_replenishment_bp.route('/api/stock-replenishment/products', methods=['POST'])
@login_required
@role_required('Supplier')
def add_product():
    data = request.get_json()  # Get the JSON data from the request

    if not data:
        return validation_error('Request payload is missing')

    # Validate required fields
    required_fields = ['supplier_id', 'name', 'price', 'weight', 'quantity']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return validation_error(f'Missing required fields: {", ".join(missing_fields)}')

    new_product = Product(
        supplier_id=data['supplier_id'],
        name=data['name'],
        price=data['price'],
        weight=data['weight'],
        quantity=data['quantity']
    )

    # Add the new product to the database
    db.session.add(new_product)
    db.session.commit()

    return jsonify(new_product.to_dict()), 201


# Place a replenishment order
@stock_replenishment_bp.route('/api/replenishment-orders', methods=['POST'])
@login_required
@role_required('Inventory Manager')
def place_replenishment_order():
    data = request.get_json()

    if not data:
        return validation_error('Request payload is missing')

    required_fields = ['inventory_manager_id', 'supplier_id', 'address', 'mobile_number', 'items']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return validation_error(f'Missing required fields: {", ".join(missing_fields)}')

    try:
        order = ReplenishmentOrder(
            inventory_manager_id=data['inventory_manager_id'],
            supplier_id=data['supplier_id'],
            address=data['address'],
            mobile_number=data['mobile_number'],
        )
        db.session.add(order)
        db.session.commit()

        # Add order items
        for item in data['items']:
            required_fields = ['product_id', 'product_name',
                                'quantity', 'weight', 'price']
            missing_fields = [
                field for field in required_fields if field not in item]
            if missing_fields:
                return validation_error(f'Missing required fields in items: {", ".join(missing_fields)}')

            order_item = ReplenishmentOrderItem(
                replenishment_order_id=order.id,
                product_id=item['product_id'],
                product_name=item['product_name'],
                quantity=item['quantity'],
                weight=item['weight'],
                price=item['price']
            )
            db.session.add(order_item)

            # reduce the quantity of the product in the products table
            product = Product.query.get(item['product_id'])
            product.quantity -= int(item['quantity'])
            db.session.add(product)

        db.session.commit()
        return jsonify({"message": "Replenishment order placed successfully", "order": order.to_dict()}), 201
    except Exception as e:
        return internal_server_error(str(e))


# Get all replenishment orders
@stock_replenishment_bp.route('/api/replenishment-orders', methods=['GET'])
@login_required
@role_required('Inventory Manager', 'Supplier')
def get_replenishment_orders():
    orders = ReplenishmentOrder.query.all()
    return jsonify([order.to_dict() for order in orders]), 200


# Update replenishment order
@stock_replenishment_bp.route('/api/replenishment-orders/<int:order_id>', methods=['PUT'])
@login_required
@role_required('Supplier')
def update_replenishment_order(order_id):
    data = request.get_json()
    
    if not data:
        return validation_error('Request payload is missing')
    
    order = ReplenishmentOrder.query.get(order_id)
    if not order:
        return not_found_error('Order')

    try:
        for key, value in data.items():
            if hasattr(order, key):
                if key == 'expected_delivery_time':
                    value = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
                setattr(order, key, value)
                
        db.session.commit()
        return jsonify({"message": "Order updated successfully", "order": order.to_dict()}), 200
    except Exception as e:
        return internal_server_error(str(e))

# Supply Orders Overview
@stock_replenishment_bp.route('/supply-orders', methods=['GET'])
def get_supply_orders():
    try:
        # Fetch all replenishment orders
        orders = ReplenishmentOrder.query.all()

        # Transform each order to include product name, total cost, etc.
        order_details = [order.to_dict() for order in orders]

        return jsonify(order_details), 200
    except Exception as e:
        return internal_server_error(str(e))


# to change the status of order and add delivery date
@stock_replenishment_bp.route('/replenishment-orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    data = request.get_json()

    # Fetch the order
    order = ReplenishmentOrder.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    try:
        # Update the status if provided
        if 'status' in data:
            status = data['status'].strip()
            if status not in ['Pending', 'Approved', 'Rejected', 'Dispatched', 'Delayed', 'Processing', 'Order Received']:
                return jsonify({"error": "Invalid status"}), 400
            order.status = status

        # Update the expected delivery time if provided
        if 'expected_delivery_time' in data:
            try:
                delivery_time = datetime.strptime(
                    data['expected_delivery_time'], "%Y-%m-%d %H:%M:%S")
                order.expected_delivery_time = delivery_time
            except ValueError:
                return jsonify({"error": "Invalid date format. Use 'YYYY-MM-DD HH:MM:SS'."}), 400

        # Commit the changes
        db.session.commit()
        return jsonify({"message": "Order updated successfully", "order": order.to_dict()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
