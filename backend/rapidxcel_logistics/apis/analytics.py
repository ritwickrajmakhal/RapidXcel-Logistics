from flask import Blueprint, request, jsonify
from .utils import role_required
from flask_login import login_required
import random

analytics_bp = Blueprint('analytics', __name__)

# Analytics Route (Mock data for testing)
@analytics_bp.route('/api/analytics', methods=['GET'])
@login_required
@role_required('Inventory Manager')
def get_analytics():
    start_date = request.args.get('startDate')
    end_date = request.args.get('endDate')

    # Validate parameters
    if not start_date or not end_date:
        return jsonify({"error": "Missing start date or end date"}), 400

    # Generate mock sales and profit data for the given date range
    sales_data = [random.randint(50, 200) for _ in range(4)]  # Mock sales data
    profits_data = [random.randint(10, 80) for _ in range(4)]  # Mock profits data

    data = {
        'labels': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        'salesData': sales_data,
        'profitsData': profits_data
    }

    return jsonify(data)