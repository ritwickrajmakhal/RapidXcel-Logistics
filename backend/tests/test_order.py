import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from rapidxcel_logistics import create_app, db
from rapidxcel_logistics.models import Order, User

@pytest.fixture
def app():
    app = create_app({
        'TESTING': True,
        'SQLALCHEMY_DATABASE_URI': 'sqlite:///:memory:',
    })

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

def test_get_orders_empty_db(client):
    response = client.get('/api/orders')
    assert response.status_code == 200
    assert response.json == []

def test_create_order_invalid_body(client):
    response = client.post('/api/orders', json={})
    assert response.status_code == 400
    assert response.json == {"error": "Request payload is missing"}

def test_create_order_valid_body(client):
    response = client.post('/api/orders', json={
        'customer_id': 1,
        'shipping_address': '123 Test St',
        'consignment_weight': 10.0
    })
    assert response.status_code == 201
    assert response.json == {
        "message": "Order created successfully",
        "order_id": 1
    }

def test_get_order_invalid_id(client):
    response = client.get('/api/orders/999')
    assert response.status_code == 404
    assert response.json == {"error": "Order not found"}

def test_get_order_valid_id(client):
    client.post('/api/orders', json={
        'customer_id': 1,
        'shipping_address': '123 Test St',
        'consignment_weight': 10.0
    })
    response = client.get('/api/orders/1')
    assert response.status_code == 200
    assert 'id' in response.json
    assert response.json['id'] == 1

def test_delete_order_invalid_id(client):
    response = client.delete('/api/orders/999')
    assert response.status_code == 404
    assert response.json == {"error": "Order not found"}

def test_delete_order_valid_id(client):
    client.post('/api/orders', json={
        'customer_id': 1,
        'shipping_address': '123 Test St',
        'consignment_weight': 10.0
    })
    response = client.delete('/api/orders/1')
    assert response.status_code == 200
    assert response.json == {"message": "Order deleted successfully"}