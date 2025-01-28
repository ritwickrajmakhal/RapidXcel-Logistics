import pytest
from rapidxcel_logistics.models import User, db
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
def init_suppliers(app):
    with app.app_context():
        supplier1 = User(
            role='Supplier',
            name='Supplier 1',
            email='supplier1@example.com',
            password_hash=generate_password_hash('password'),
            phone_number='1234567890',
            address='123 Supplier St'
        )
        supplier2 = User(
            role='Supplier',
            name='Supplier 2',
            email='supplier2@example.com',
            password_hash=generate_password_hash('password'),
            phone_number='0987654321',
            address='456 Supplier Ave'
        )
        db.session.add(supplier1)
        db.session.add(supplier2)
        db.session.commit()


def test_add_supplier(client, auth):
    auth()
    response = client.post('/api/suppliers', json={
        'name': 'New Supplier',
        'email': 'newsupplier@example.com',
        'password': 'password',
        'phone_number': '1112223333',
        'address': '789 Supplier Blvd'
    })
    assert response.status_code == 201
    assert response.json['message'] == 'Supplier added successfully'


def test_get_suppliers(client, auth, init_suppliers):
    auth()
    response = client.get('/api/suppliers')
    assert response.status_code == 200
    assert len(response.json) == 2


def test_get_supplier(client, auth, init_suppliers):
    auth()
    response = client.get('/api/suppliers/1')
    assert response.status_code == 200
    assert response.json['name'] == 'Supplier 1'


def test_update_supplier(client, auth, init_suppliers):
    auth()
    response = client.put('/api/suppliers/1', json={
        'name': 'Updated Supplier 1',
        'email': 'updatedsupplier1@example.com'
    })
    assert response.status_code == 200
    assert response.json['message'] == 'Supplier updated successfully'
    assert response.json['supplier']['name'] == 'Updated Supplier 1'


def test_delete_supplier(client, auth, init_suppliers):
    auth()
    response = client.delete('/api/suppliers/1')
    assert response.status_code == 200
    assert response.json['message'] == 'Supplier deleted successfully'
