import pytest
from datetime import datetime, timedelta
from rapidxcel_logistics.models import User, Order, db
from werkzeug.security import generate_password_hash

@pytest.fixture
def auth(client):
    def register_and_login(name='Inventory Manager', email='manager@example.com', password='password', role='Inventory Manager'):
        client.post('/auth/register', json={
            'name': name,
            'email': email,
            'password': password,
            'role': role
        })
        client.post('/auth/login', json={
            'email': email,
            'password': password
        })
    return register_and_login

@pytest.fixture
def init_orders(app):
    with app.app_context():
        inventory_manager = User(
            role='Inventory Manager',
            name='Inventory Manager',
            email='manager@example.com',
            password_hash=generate_password_hash('password')
        )
        db.session.add(inventory_manager)
        db.session.commit()

        # Create orders with different dates
        today = datetime.today()
        order1 = Order(
            customer_id=1,
            courier_service_id=1,
            shipping_address='123 Test St',
            consignment_weight=1.5,
            shipping_cost=10.0,
            delivery_date=today - timedelta(days=30),
            pin_code='123456',
            phone_number='1234567890',
            created_at=today - timedelta(days=30)
        )
        order2 = Order(
            customer_id=1,
            courier_service_id=1,
            shipping_address='123 Test St',
            consignment_weight=1.5,
            shipping_cost=10.0,
            delivery_date=today - timedelta(days=15),
            pin_code='123456',
            phone_number='1234567890',
            created_at=today - timedelta(days=15)
        )
        db.session.add(order1)
        db.session.add(order2)
        db.session.commit()

def test_get_analytics(client, auth, init_orders):
    auth()
    response = client.get('/api/analytics', query_string={
        'startDate': (datetime.today() - timedelta(days=60)).strftime('%Y-%m-%d'),
        'endDate': datetime.today().strftime('%Y-%m-%d')
    })
    assert response.status_code == 200
    assert 'labels' in response.json
    assert 'orderData' in response.json
    assert len(response.json['labels']) == 2
    assert len(response.json['orderData']) == 2

def test_get_analytics_missing_dates(client, auth):
    auth()
    response = client.get('/api/analytics')
    assert response.status_code == 400
    assert response.json['error'] == 'startDate and endDate are required query parameters. Please provide both.'

def test_get_analytics_invalid_date_format(client, auth):
    auth()
    response = client.get('/api/analytics', query_string={
        'startDate': 'invalid-date',
        'endDate': 'invalid-date'
    })
    assert response.status_code == 400
    assert response.json['error'] == 'Invalid date format. Please provide dates in the format YYYY-MM-DD.'