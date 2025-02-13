from flask import Blueprint, request, jsonify
from .utils import role_required, validation_error
from flask_login import login_required
from datetime import datetime
from rapidxcel_logistics.models import db, Order, Stock, User, ReplenishmentOrder, ReplenishmentOrderItem, OrderItem

analytics_bp = Blueprint('analytics', __name__)


def get_dates():
    start_date = request.args.get('startDate')  # format 'YYYY-MM-DD'
    end_date = request.args.get('endDate')      # format 'YYYY-MM-DD'

    if not start_date or not end_date:
        return None, None, validation_error('startDate and endDate are required query parameters. Please provide both.')

    try:
        # Validate the date format
        datetime.strptime(start_date, '%Y-%m-%d')
        datetime.strptime(end_date, '%Y-%m-%d')
        return start_date, end_date, None
    except ValueError:
        return None, None, validation_error('Invalid date format. Please provide dates in the format YYYY-MM-DD.')


# Analytics Route
@analytics_bp.route('/api/order-performance-and-demand-analysis', methods=['GET'])
@login_required
@role_required('Inventory Manager')
def get_analytics():
    start_date, end_date, error = get_dates()
    if error:
        return error

    data = {
        'order_fulfilment_rate': {},
        'order_volume_trends': {}
    }

    # Order Fulfilment rate: A line or bar chart displaying the percentage of orders fulfilled on time versus delayed, helping track fulfilment efficiency.

    results = db.session.query(
        db.func.strftime('%Y-%m', Order.created_at).label('month'),
        db.func.count(Order.id).label('total_orders'),
        db.func.sum(db.case((Order.status == 'Delivered', 1),
                    else_=0)).label('fulfilled_orders')
    ).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).group_by('month').order_by('month').all()

    if results:
        data['order_fulfilment_rate'] = {
            'months': [r[0] for r in results],
            'total_orders': [r[1] for r in results],
            'fulfilled_orders': [r[2] for r in results]
        }
    else:
        data['order_fulfilment_rate'] = {
            'months': [],
            'total_orders': [],
            'fulfilled_orders': []
        }

    # Order Volume Trends
    results = db.session.query(
        db.func.strftime('%Y-%m', Order.created_at).label('month'),
        db.func.count(Order.id).label('order_count')
    ).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).group_by('month').order_by('month').all()

    if results:
        data['order_volume_trends'] = {
            'months': [r[0] for r in results],
            'order_counts': [r[1] for r in results]
        }
    else:
        data['order_volume_trends'] = {
            'months': [],
            'order_counts': []
        }
    return jsonify(data), 200


@analytics_bp.route("/api/inventory-reports", methods=['GET'])
@login_required
@role_required('Inventory Manager')
def get_inventory_reports():
    start_date, end_date, error = get_dates()
    if error:
        return error

    data = {
        'stock_levels': {},
        'supplier_stock_distribution': {}
    }
    # fetch all the stocks created within start_date and end_date with their respective quantities
    results = db.session.query(
        Stock.stock_name,
        db.func.sum(Stock.quantity).label('total_quantity')
    ).filter(
        Stock.created_at >= start_date,
        Stock.created_at <= end_date
    ).group_by('stock_name').order_by('stock_name').all()

    if results:
        data['stock_levels'] = {'products': [
            r[0] for r in results], 'quantities': [r[1] for r in results]}

    else:
        data['stock_levels'] = {'products': [], 'quantities': []}

    # A stacked bar chart representing the various products supplied by each supplier.
    results = db.session.query(
        User.name.label('supplier_name'),
        db.func.count(ReplenishmentOrderItem.id).label('total_products')
    ).join(ReplenishmentOrder, ReplenishmentOrder.supplier_id == User.id
           ).join(ReplenishmentOrderItem, ReplenishmentOrderItem.replenishment_order_id == ReplenishmentOrder.id
                  ).filter(
        ReplenishmentOrder.created_at >= start_date,
        ReplenishmentOrder.created_at <= end_date,
        ReplenishmentOrder.status == 'Delivered'
    ).group_by(User.name).order_by(User.name).all()

    if results:
        data['supplier_stock_distribution'] = {
            'suppliers': [r[0] for r in results],
            'total_products': [r[1] for r in results]
        }
    else:
        data['supplier_stock_distribution'] = {
            'suppliers': [], 'total_products': []
        }
    return jsonify(data), 200


@analytics_bp.route("/api/sales-reports", methods=['GET'])
@login_required
@role_required('Inventory Manager')
def get_sales_report():
    start_date, end_date, error = get_dates()
    if error:
        return error

    data = {
        'product_sales_trends': {},
        'profit_loss_reports': {}
    }

    # Product Sales Trends: A line or bar chart displaying the sales trends of individual products, identifying bestsellers, low performers, and seasonal fluctuations.
    results = db.session.query(
        OrderItem.product_name,
        db.func.strftime('%Y-%m', Order.created_at).label('month'),
        db.func.sum(OrderItem.quantity).label('total_quantity')
    ).join(Order, Order.id == OrderItem.order_id).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).group_by(OrderItem.product_name, 'month').order_by(OrderItem.product_name, 'month').all()

    product_sales = {}
    for product_name, month, total_quantity in results:
        if product_name not in product_sales:
            product_sales[product_name] = {'months': [], 'quantities': []}
        product_sales[product_name]['months'].append(month)
        product_sales[product_name]['quantities'].append(total_quantity)

    sorted_products = sorted(product_sales.items(), key=lambda x: sum(
        x[1]['quantities']), reverse=True)
    bestsellers = sorted_products[:5]
    low_performers = sorted_products[-5:]

    data['product_sales_trends'] = {
        'bestsellers': bestsellers,
        'low_performers': low_performers
    }

    return jsonify(data), 200
