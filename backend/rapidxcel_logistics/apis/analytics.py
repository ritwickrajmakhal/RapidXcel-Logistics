from flask import Blueprint, request, jsonify
from .utils import role_required, validation_error
from flask_login import login_required
from datetime import datetime
from rapidxcel_logistics.models import db, Order

analytics_bp = Blueprint('analytics', __name__)

# Analytics Route
@analytics_bp.route('/api/analytics', methods=['GET'])
@login_required
@role_required('Inventory Manager')
def get_analytics():
    start_date = request.args.get('startDate')  # format 'YYYY-MM-DD'
    end_date = request.args.get('endDate')      # format 'YYYY-MM-DD'

    if not start_date or not end_date:
        return validation_error('startDate and endDate are required query parameters. Please provide both.')

    try:
        # Validate the date format
        datetime.strptime(start_date, '%Y-%m-%d')
        datetime.strptime(end_date, '%Y-%m-%d')
    except ValueError:
        return validation_error('Invalid date format. Please provide dates in the format YYYY-MM-DD.')

    # Perform the database query with date range filtering (no time needed anymore)
    results = db.session.query(
        db.func.strftime('%Y-%m', Order.created_at).label('month'),
        db.func.count(Order.id).label('order_count')
    ).filter(
        Order.created_at >= start_date,
        Order.created_at <= end_date
    ).group_by('month').order_by('month').all()

    if results:
        data = {
            'labels': [r[0] for r in results],
            'orderData': [r[1] for r in results]
        }
    else:
        data = {
            'labels': [],
            'orderData': []
        }

    return jsonify(data), 200