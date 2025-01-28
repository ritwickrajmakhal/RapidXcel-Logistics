import pytest
from rapidxcel_logistics.models import User, db


def test_register(client, init_db):
    response = client.post('/auth/register', json={
        'name': 'Test User',
        'email': 'testuser@example.com',
        'password': 'password',
        'role': 'Customer'
    })
    assert response.status_code == 201
    assert response.json == {'message': 'User registered successfully'}


def test_register_missing_fields(client, init_db):
    response = client.post('/auth/register', json={
        'name': 'Test User',
        'email': 'testuser@example.com'
    })
    assert response.status_code == 400
    assert 'Missing required fields' in response.json['error']


def test_login(client, init_db):
    client.post('/auth/register', json={
        'name': 'Test User',
        'email': 'testuser@example.com',
        'password': 'password',
        'role': 'Customer'
    })
    response = client.post('/auth/login', json={
        'email': 'testuser@example.com',
        'password': 'password'
    })
    assert response.status_code == 200
    assert response.json == {'message': 'Logged in successfully'}


def test_login_invalid_credentials(client, init_db):
    response = client.post('/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'password'
    })
    assert response.status_code == 401
    assert response.json == {'message': 'Invalid credentials'}


def test_logout(client, init_db):
    client.post('/auth/register', json={
        'name': 'Test User',
        'email': 'testuser@example.com',
        'password': 'password',
        'role': 'Customer'
    })
    client.post('/auth/login', json={
        'email': 'testuser@example.com',
        'password': 'password'
    })
    response = client.post('/auth/logout')
    assert response.status_code == 200
    assert response.json == {'message': 'Logged out successfully'}


def test_profile(client, init_db):
    client.post('/auth/register', json={
        'name': 'Test User',
        'email': 'testuser@example.com',
        'password': 'password',
        'role': 'Customer'
    })
    client.post('/auth/login', json={
        'email': 'testuser@example.com',
        'password': 'password'
    })
    response = client.get('/auth/profile')
    assert response.status_code == 200
    assert response.json['email'] == 'testuser@example.com'


def test_forgot_password(client, init_db):
    client.post('/auth/register', json={
        'name': 'Test User',
        'email': 'testuser@example.com',
        'password': 'password',
        'role': 'Customer'
    })
    response = client.post('/auth/forgot-password', json={
        'email': 'testuser@example.com'
    })
    assert response.status_code == 200
    assert response.json == {'message': 'Password reset email sent'}


def test_reset_password(client, init_db):
    client.post('/auth/register', json={
        'name': 'Test User',
        'email': 'testuser@example.com',
        'password': 'password',
        'role': 'Customer'
    })
    client.post('/auth/forgot-password', json={
        'email': 'testuser@example.com'
    })
    user = User.query.filter_by(email='testuser@example.com').first()
    token = user.reset_token
    response = client.post(f'/auth/reset-password/{token}', json={
        'password': 'newpassword'
    })
    assert response.status_code == 200
    assert response.json == {'message': 'Password reset successful'}

    # Verify that the new password works
    response = client.post('/auth/login', json={
        'email': 'testuser@example.com',
        'password': 'newpassword'
    })
    assert response.status_code == 200
    assert response.json == {'message': 'Logged in successfully'}
