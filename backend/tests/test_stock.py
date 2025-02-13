from rapidxcel_logistics.models import Stock
import pytest
from rapidxcel_logistics import db


@pytest.fixture
def auth(client):
    def register_and_login(name='IM', email='IM@example.com', password='password', role='Inventory Manager'):
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


def test_create_stock(client, auth):
    auth()
    response = client.post('/api/stocks', json={
        'inventory_manager_id': 2,
        'name': 'Stock 1',
        'quantity': 100,
        'price': 10,
        'weight': 0.0,
    })
    assert response.status_code == 201
    response_json = response.json
    assert response_json['message'] == 'Stock is Added Successfully'
    assert response_json['stock']['price'] == 10
    assert response_json['stock']['quantity'] == 100
    assert response_json['stock']['stock_id'] == 1
    assert response_json['stock']['stock_name'] == 'Stock 1'
    assert response_json['stock']['weight'] == 0.0
    assert 'created_At' in response_json['stock']

def test_create_stock_invalid_body(client, auth):
    auth()
    response = client.post('/api/stocks', json={})
    assert response.status_code == 400
    assert response.json == {"error": "Please provide required data"}

    response = client.post('/api/stocks', json={'name': 'Stock 1'})
    assert response.status_code == 400
    assert response.json == {
        "error": "Missing Fields: inventory_manager_id, price, quantity, weight"}


def test_get_stocks(client, auth):
    auth()
    response = client.get('/api/stocks')
    assert response.status_code == 200
    assert response.json == []

    response = client.post('/api/stocks', json={
        'inventory_manager_id': 2,
        'name': 'Stock 1',
        'quantity': 100,
        'price': 10,
        'weight': 0.0
    })
    assert response.status_code == 201

    response = client.get('/api/stocks')
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['stock_name'] == 'Stock 1'
    assert response.json[0]['price'] == 10
    assert response.json[0]['quantity'] == 100
    assert response.json[0]['weight'] == 0.0


def test_delete_stock(client, auth):
    auth()
    response = client.post('/api/stocks', json={
        'inventory_manager_id': 2,
        'name': 'Stock 1',
        'quantity': 100,
        'price': 10,
        'weight': 0.0
    })
    assert response.status_code == 201

    stock = Stock.query.filter_by(stock_name='Stock 1').first()
    assert stock is not None

    response = client.delete(f'/api/stocks/{stock.stock_id}')
    assert response.status_code == 200
    response_json = response.json
    assert response_json['message'] == 'Stock Deleted Successfully'
    assert response_json['stock']['price'] == 10
    assert response_json['stock']['quantity'] == 100
    assert response_json['stock']['stock_id'] == 1
    assert response_json['stock']['stock_name'] == 'Stock 1'
    assert response_json['stock']['weight'] == 0.0
    assert 'created_At' in response_json['stock']

    stock = Stock.query.filter_by(stock_name='Stock 1').first()
    assert stock is None


def test_update_stock(client, auth):
    auth()
    response = client.post('/api/stocks', json={
        'inventory_manager_id': 2,
        'name': 'Stock 1',
        'quantity': 100,
        'price': 10,
        'weight': 0.0
    })
    assert response.status_code == 201

    stock = Stock.query.filter_by(stock_name='Stock 1').first()
    assert stock is not None

    response = client.put(f'/api/stocks/{stock.stock_id}', json={
        'inventory_manager_id': 2,
        'name': 'Stock 2',
        'quantity': 200,
        'price': 20,
        'weight': 1.0
    })
    assert response.status_code == 200
    response_json = response.json
    assert response_json['message'] == 'Stock Updated Successfully'
    assert response_json['stock']['price'] == 20
    assert response_json['stock']['quantity'] == 200
    assert response_json['stock']['stock_id'] == 1
    assert response_json['stock']['stock_name'] == 'Stock 2'
    assert response_json['stock']['weight'] == 1.0
    assert 'created_At' in response_json['stock']

    stock = Stock.query.filter_by(stock_name='Stock 2').first()
    assert stock is not None
    assert stock.price == 20
    assert stock.quantity == 200
    assert stock.weight == 1.0


def test_get_stock_by_id(client, auth):
    auth()
    response = client.post('/api/stocks', json={
        'inventory_manager_id': 2,
        'name': 'Stock 1',
        'quantity': 100,
        'price': 10,
        'weight': 0.0
    })
    assert response.status_code == 201

    stock = Stock.query.filter_by(stock_name='Stock 1').first()
    assert stock is not None

    response = client.get(f'/api/stocks/{stock.stock_id}')
    assert response.status_code == 200
    assert response.json['stock_name'] == 'Stock 1'
    assert response.json['price'] == 10
    assert response.json['quantity'] == 100
    assert response.json['weight'] == 0.0


def test_get_stock_by_id_invalid_id(client, auth):
    auth()
    response = client.get('/api/stocks/999')
    assert response.status_code == 404
    assert response.json == {"error": "Stock not found"}


def test_delete_stock_invalid_id(client, auth):
    auth()
    response = client.delete('/api/stocks/999')
    assert response.status_code == 404
    print(response.json)
    assert response.json == {"error": "Stock not found"}


def test_update_stock_invalid_id(client, auth):
    auth()
    response = client.put('/api/stocks/999', json={
        'inventory_manager_id': 2,
        'name': 'Stock 2',
        'quantity': 200,
        'price': 20,
        'weight': 1.0
    })
    assert response.status_code == 404
    assert response.json == {"error": "Stock not found"}


def test_update_stock_invalid_body(client, auth):
    auth()
    response = client.post('/api/stocks', json={
        'inventory_manager_id': 2,
        'name': 'Stock 1',
        'quantity': 100,
        'price': 10,
        'weight': 0.0
    })
    assert response.status_code == 201

    stock = Stock.query.filter_by(stock_name='Stock 1').first()
    assert stock is not None

    response = client.put(f'/api/stocks/{stock.stock_id}', json={})
    assert response.status_code == 400
    assert response.json == {"error": "Please provide required data"}


def test_delete_stock_invalid_id(client, auth):
    auth()
    response = client.delete('/api/stocks/999')
    assert response.status_code == 404
    assert response.json == {"error": "Stock not found"}
