from flask import Blueprint, jsonify
from rapidxcel_logistics.models import User
from .utils import role_required
from flask_login import login_required

courier_service_bp = Blueprint('courier', __name__)

# Route for fetching all Couriers
@courier_service_bp.route('/api/couriers-services', methods=['GET'])
@login_required
@role_required('Customer')
def get_couriers():
    try:
        couriers = User.query.filter_by(role='Courier Service').all()
        couriers_list = [courier.to_dict() for courier in couriers]
        return jsonify(couriers_list)
    except Exception as e:
        return jsonify({"danger":"Some Error Occured"}), 500