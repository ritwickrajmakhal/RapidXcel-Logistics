from rapidxcel_logistics.models import Stock, User
import pytest
from rapidxcel_logistics import db


@pytest.fixture
def auth(client):
    def register_and_login(name='Text Example', email='test@example.com', password='password', role='Customer'):
        register_response = client.post('/auth/register', json={
            'name': name,
            'email': email,
            'password': password,
            'role': role
        })
        print(
            f"Register response: {register_response.status_code}, {register_response.json}")

        login_response = client.post('/auth/login', json={
            'email': email,
            'password': password
        })
        print(
            f"Login response: {login_response.status_code}, {login_response.json}")

        assert register_response.status_code == 201
        assert login_response.status_code == 200

    return register_and_login


@pytest.fixture
def init_stocks(app):
    with app.app_context():
        # Assuming you have a valid inventory manager with id 1
        inventory_manager_id = 1
        stock1 = Stock(inventory_manager_id=inventory_manager_id,
                       stock_name='Product 1', price=100, quantity=50, weight=1.5)
        stock2 = Stock(inventory_manager_id=inventory_manager_id,
                       stock_name='Product 2', price=200, quantity=30, weight=2.0)
        db.session.add(stock1)
        db.session.add(stock2)
        db.session.commit()


def test_get_orders_empty_db(client, auth):
    auth()
    response = client.get('/api/orders')
    assert response.status_code == 200
    assert response.json == []


def test_create_order_invalid_body(client, auth):
    auth()
    response = client.post('/api/orders', json={})
    assert response.status_code == 400
    assert response.json == {"error": "Request payload is missing"}


def test_create_order_valid_body(client, auth, init_stocks):
    auth()
    response = client.post('/api/orders', json={
        'customer_id': 1,
        'courier_service_id': 2,
        'shipping_address': '123 Test St',
        'pin_code': '123456',
        'phone_number': '1234567890',
        'items': [{'stock_id': 1, 'product_name': 'Product 1', 'quantity': 2, 'weight': 5.0, 'price': 100.0}],
        'location_type': 'urban'
    })
    assert response.status_code == 201
    assert response.json == {
        "message": "Order created successfully",
        "order_id": 1
    }


def test_get_order_invalid_id(client, auth):
    auth()
    response = client.get('/api/orders/999')
    assert response.status_code == 404
    assert response.json == {"error": "Order not found"}


def test_get_order_valid_id(client, auth, init_stocks):
    auth()
    response = client.post('/api/orders', json={
        'customer_id': 1,
        'courier_service_id': 2,
        'shipping_address': '123 Test St',
        'pin_code': '123456',
        'phone_number': '1234567890',
        'items': [{'stock_id': 1, 'product_name': 'Product 1', 'quantity': 2, 'weight': 1.5, 'price': 100.0}],
        'location_type': 'urban'
    })
    assert response.status_code == 201
    order_id = response.json['order_id']

    response = client.get(f'/api/orders/{order_id}')
    assert response.status_code == 200


def test_delete_order_invalid_id(client, auth):
    auth()
    response = client.delete('/api/orders/999')
    assert response.status_code == 404
    assert response.json == {"error": "Order not found"}


def test_delete_order_valid_id(client, auth):
    auth()
    client.post('/api/orders', json={
        'customer_id': 1,
        'courier_service_id': 2,
        'shipping_address': '123 Test St',
        'pin_code': '123456',
        'phone_number': '1234567890',
        'items': [{'product_id': 1, 'quantity': 2, 'weight': 5.0, 'price': 100.0}],
        'location_type': 'urban'
    })
    response = client.delete('/api/orders/1')
    assert response.status_code == 200
    assert response.json == {"message": "Order deleted successfully"}


def test_update_order_valid_id(client, auth):
    auth()
    # Create an order to update
    client.post('/api/orders', json={
        'customer_id': 1,
        'courier_service_id': 2,
        'shipping_address': '123 Test St',
        'pin_code': '123456',
        'phone_number': '1234567890',
        'items': [{'product_id': 1, 'quantity': 2, 'weight': 5.0, 'price': 100.0}],
        'location_type': 'urban'
    })
    response = client.put('/api/orders/1', json={
        'shipping_address': '456 New St'
    })
    assert response.status_code == 200
    assert response.json == {"message": "Order updated successfully"}


def test_update_order_invalid_id(client, auth):
    auth()
    response = client.put('/api/orders/999', json={
        'shipping_address': '456 New St'
    })
    assert response.status_code == 404
    assert response.json == {"error": "Order not found"}
