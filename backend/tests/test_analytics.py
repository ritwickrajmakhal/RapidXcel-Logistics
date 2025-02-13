import pytest
from datetime import datetime, timedelta
from rapidxcel_logistics.models import User, Order, Stock, db
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
            delivery_date=today - timedelta(days=60),
            pin_code='123456',
            phone_number='1234567890',
            created_at=today - timedelta(days=60)
        )
        db.session.add(order1)
        db.session.add(order2)
        db.session.commit()

@pytest.fixture
def init_stocks(app):
    with app.app_context():
        stock1 = Stock(
            inventory_manager_id=1,
            stock_name='Product A',
            price=100.0,
            quantity=100,
            weight=1.0,
            created_at=datetime.today() - timedelta(days=30)
        )
        stock2 = Stock(
            inventory_manager_id=1,
            stock_name='Product B',
            price=200.0,
            quantity=200,
            weight=2.0,
            created_at=datetime.today() - timedelta(days=15)
        )
        db.session.add(stock1)
        db.session.add(stock2)
        db.session.commit()

def test_get_order_performance_and_demand_analysis(client, auth, init_orders):
    auth()
    response = client.get('/api/order-performance-and-demand-analysis', query_string={
        'startDate': (datetime.today() - timedelta(days=60)).strftime('%Y-%m-%d'),
        'endDate': datetime.today().strftime('%Y-%m-%d')
    })

    assert response.status_code == 200
    assert 'order_fulfilment_rate' in response.json
    assert 'order_volume_trends' in response.json
    assert len(response.json['order_fulfilment_rate']['months']) == 2
    assert len(response.json['order_volume_trends']['months']) == 2

def test_get_order_performance_and_demand_analysis_missing_dates(client, auth):
    auth()
    response = client.get('/api/order-performance-and-demand-analysis')
    assert response.status_code == 400
    assert response.json['error'] == 'startDate and endDate are required query parameters. Please provide both.'

def test_get_order_performance_and_demand_analysis_invalid_date_format(client, auth):
    auth()
    response = client.get('/api/order-performance-and-demand-analysis', query_string={
        'startDate': 'invalid-date',
        'endDate': 'invalid-date'
    })
    assert response.status_code == 400
    assert response.json['error'] == 'Invalid date format. Please provide dates in the format YYYY-MM-DD.'

def test_get_inventory_reports(client, auth, init_stocks):
    auth()
    response = client.get('/api/inventory-reports', query_string={
        'startDate': (datetime.today() - timedelta(days=60)).strftime('%Y-%m-%d'),
        'endDate': datetime.today().strftime('%Y-%m-%d')
    })
    assert response.status_code == 200
    assert 'stock_levels' in response.json
    assert 'supplier_stock_distribution' in response.json

def test_get_inventory_reports_missing_dates(client, auth):
    auth()
    response = client.get('/api/inventory-reports')
    assert response.status_code == 400
    assert response.json['error'] == 'startDate and endDate are required query parameters. Please provide both.'

def test_get_inventory_reports_invalid_date_format(client, auth):
    auth()
    response = client.get('/api/inventory-reports', query_string={
        'startDate': 'invalid-date',
        'endDate': 'invalid-date'
    })
    assert response.status_code == 400
    assert response.json['error'] == 'Invalid date format. Please provide dates in the format YYYY-MM-DD.'

def test_get_sales_report(client, auth, init_orders):
    auth()
    response = client.get('/api/sales-reports', query_string={
        'startDate': (datetime.today() - timedelta(days=60)).strftime('%Y-%m-%d'),
        'endDate': datetime.today().strftime('%Y-%m-%d')
    })
    assert response.status_code == 200
    assert 'product_sales_trends' in response.json
    assert 'profit_loss_reports' in response.json

def test_get_sales_report_missing_dates(client, auth):
    auth()
    response = client.get('/api/sales-reports')
    assert response.status_code == 400
    assert response.json['error'] == 'startDate and endDate are required query parameters. Please provide both.'

def test_get_sales_report_invalid_date_format(client, auth):
    auth()
    response = client.get('/api/sales-reports', query_string={
        'startDate': 'invalid-date',
        'endDate': 'invalid-date'
    })
    assert response.status_code == 400
    assert response.json['error'] == 'Invalid date format. Please provide dates in the format YYYY-MM-DD.'