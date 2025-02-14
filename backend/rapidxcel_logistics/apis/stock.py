from flask import Blueprint, request, jsonify
from rapidxcel_logistics.models import Stock
from rapidxcel_logistics import db
from .utils import role_required, validation_error, not_found_error, internal_server_error
from flask_login import login_required
from datetime import datetime

stock_bp = Blueprint('stock', __name__)


# Route for fetching all Stocks
@stock_bp.route('/api/stocks', methods=['GET'])
@login_required
@role_required('Inventory Manager', 'Customer')
def get_stocks():
    try:
        stocks = Stock.query.all()
        stocks_list = [stock.to_dict() for stock in stocks]
        return jsonify(stocks_list)
    except Exception as e:
        return internal_server_error(str(e))


# Route to add a new Stock
@stock_bp.route('/api/stocks', methods=['POST'])
@login_required
@role_required('Inventory Manager')
def add_stock():
    data = request.get_json()

    if not data:
        return validation_error("Please provide required data")

    requied_fields = ['inventory_manager_id', 'name', 'price', 'quantity', 'weight']
    missing_fields = [field for field in requied_fields if field not in data]
    if missing_fields:
        return validation_error(f"Missing Fields: {', '.join(missing_fields)}")

    new_stock = Stock(
        inventory_manager_id=data["inventory_manager_id"],
        stock_name=data["name"],
        price=data["price"],
        quantity=data["quantity"],
        weight=data["weight"]
    )

    try:
        db.session.add(new_stock)
        db.session.commit()
        return jsonify({"message": "Stock is Added Successfully", "stock" : new_stock.to_dict()}), 201
    except Exception as e:
        return internal_server_error(str(e))


# Route to delete Stock using ID
@stock_bp.route('/api/stocks/<int:stockId>', methods=['DELETE'])
@login_required
@role_required('Inventory Manager')
def delete_stock(stockId):
    stock = Stock.query.get(stockId)

    if not stock:
        return not_found_error("Stock")

    try:
        db.session.delete(stock)
        db.session.commit()
        return jsonify({"message": "Stock Deleted Successfully", "stock" : stock.to_dict()}), 200
    except Exception as e:
        return internal_server_error(str(e))


# Route to update Stock using ID
@stock_bp.route('/api/stocks/<int:stockId>', methods=["PUT"])
@login_required
@role_required('Inventory Manager')
def update_stock(stockId):
    data = request.get_json()
    if not data:
        return validation_error("Please provide required data")

    stock = Stock.query.get(stockId)

    if not stock:
        return not_found_error("Stock")

    try:
        stock.stock_name = data.get("name", stock.stock_name)
        stock.price = data.get("price", stock.price)
        stock.quantity = data.get("quantity", stock.quantity)
        stock.weight = data.get("weight", stock.weight)
        
        if 'created_at' in data:
            try:
                stock.created_at = datetime.fromisoformat(data['created_at'])
            except ValueError:
                return validation_error('Invalid datetime format for created_at')


        db.session.commit()

        return jsonify({"message": "Stock Updated Successfully", "stock": stock.to_dict()}), 200
    except Exception as e:
        return internal_server_error(str(e))


# Route to get Stock by ID
@stock_bp.route('/api/stocks/<int:stockId>', methods=['GET'])
@login_required
@role_required('Inventory Manager')
def get_stock_by_id(stockId):
    stock = Stock.query.get(stockId)

    if not stock:
        return not_found_error("Stock")

    return jsonify(stock.to_dict()), 200
