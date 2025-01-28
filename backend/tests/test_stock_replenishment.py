import pytest
from rapidxcel_logistics.models import User, Product, db
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
def auth_supplier(client):
    def register_and_login(name='Supplier', email='supplier@example.com', password='password', role='Supplier'):
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
def init_products(app):
    with app.app_context():
        supplier = User(
            role='Supplier',
            name='Supplier 1',
            email='supplier1@example.com',
            password_hash=generate_password_hash('password'),
            phone_number='1234567890',
            address='123 Supplier St'
        )
        db.session.add(supplier)
        db.session.commit()

        product1 = Product(
            supplier_id=supplier.id,
            name='Product 1',
            price=100,
            weight=1.5,
            quantity=50
        )
        product2 = Product(
            supplier_id=supplier.id,
            name='Product 2',
            price=200,
            weight=2.0,
            quantity=30
        )
        db.session.add(product1)
        db.session.add(product2)
        db.session.commit()


def test_get_products(client, auth, init_products):
    auth()
    response = client.get('/api/stock-replenishment/products')
    assert response.status_code == 200
    assert len(response.json) == 2


def test_add_product(client, auth_supplier):
    auth_supplier()
    response = client.post('/api/stock-replenishment/products', json={
        'supplier_id': 1,
        'name': 'New Product',
        'price': 150,
        'weight': 1.8,
        'quantity': 40
    })
    assert response.status_code == 201
    assert response.json['name'] == 'New Product'


def test_place_replenishment_order(client, auth, init_products):
    auth()
    response = client.post('/api/replenishment-orders', json={
        'inventory_manager_id': 1,
        'supplier_id': 1,
        'address': '123 Test St',
        'mobile_number': '1234567890',
        'items': [{'product_id': 1, 'product_name': 'Product 1', 'quantity': 5, 'weight': 1.5, 'price': 100}]
    })
    assert response.status_code == 201
    assert response.json['message'] == 'Replenishment order placed successfully'


def test_get_replenishment_orders(client, auth, init_products):
    auth()
    client.post('/api/replenishment-orders', json={
        'inventory_manager_id': 1,
        'supplier_id': 1,
        'address': '123 Test St',
        'mobile_number': '1234567890',
        'items': [{'product_id': 1, 'product_name': 'Product 1', 'quantity': 5, 'weight': 1.5, 'price': 100}]
    })
    response = client.get('/api/replenishment-orders')
    assert response.status_code == 200
    assert len(response.json) == 1


def test_update_replenishment_order(client, auth, auth_supplier, init_products):
    auth()
    client.post('/api/replenishment-orders', json={
        'inventory_manager_id': 1,
        'supplier_id': 1,
        'address': '123 Test St',
        'mobile_number': '1234567890',
        'items': [{'product_id': 1, 'product_name': 'Product 1', 'quantity': 5, 'weight': 1.5, 'price': 100}]
    })
    auth_supplier()
    response = client.put('/api/replenishment-orders/1', json={
        'address': '456 Updated St',
        'mobile_number': '0987654321'
    })

    assert response.status_code == 200
    assert response.json['message'] == 'Order updated successfully'
    assert response.json['order']['address'] == '456 Updated St'
