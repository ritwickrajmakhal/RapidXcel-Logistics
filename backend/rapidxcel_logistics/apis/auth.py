from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, logout_user, login_required, current_user
from flask_principal import Identity, AnonymousIdentity, identity_changed, RoleNeed, UserNeed
from rapidxcel_logistics.models import User
from rapidxcel_logistics import db, login_manager, mail
from .utils import internal_server_error, validation_error, not_found_error
from sqlalchemy.exc import IntegrityError
from flask_mail import Message
from datetime import datetime
import os

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return validation_error('Request payload is missing')

    required_fields = ['name', 'email', 'password', 'role']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return validation_error(f'Missing required fields: {", ".join(missing_fields)}')

    hashed_password = generate_password_hash(data['password'])
    new_user = User(name=data['name'], email=data['email'],
                    password_hash=hashed_password, role=data['role'])

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except IntegrityError as e:
        db.session.rollback()
        if 'UNIQUE constraint failed: users.email' in str(e.orig):
            return jsonify({'message': 'Email already exists'}), 400
        return internal_server_error(str(e))
    except Exception as e:
        db.session.rollback()
        return internal_server_error(str(e))


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return validation_error('Request payload is missing')

    required_fields = ['email', 'password']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return validation_error(f'Missing required fields: {", ".join(missing_fields)}')

    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        login_user(user)
        identity_changed.send(
            current_app._get_current_object(), identity=Identity(user.id))
        return jsonify({'message': 'Logged in successfully'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401


@auth_bp.route('/auth/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    identity_changed.send(current_app._get_current_object(),
                          identity=AnonymousIdentity())
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/auth/profile', methods=['GET'])
@login_required
def profile():
    user_data = current_user.to_dict()
    return jsonify(user_data), 200


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def send_reset_email(user, reset_url):
    msg = Message('Password Reset Request',
                  sender='your-email@gmail.com',
                  recipients=[user.email])

    msg.html = f'''
    <html>
    <head>
        <style>
            .container {{
                width: 100%;
                padding: 20px;
                background-color: #f4f4f4;
                font-family: Arial, sans-serif;
            }}
            .content {{
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                padding-bottom: 20px;
            }}
            .footer {{
                text-align: center;
                padding-top: 20px;
                font-size: 12px;
                color: #888888;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div class="header">
                    <h2>Password Reset Request</h2>
                </div>
                <p>Hello {user.name},</p>
                <p>You requested to reset your password. Click the button below to reset it:</p>
                <a href="{reset_url}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
                <div class="footer">
                    <p>Thank you,<br>RapidXcel Logistics Team</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    '''
    mail.send(msg)


@auth_bp.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return validation_error('Email is required')

    user = User.query.filter_by(email=email).first()
    if not user:
        return not_found_error('User')

    user.generate_reset_token()
    db.session.commit()

    reset_url = f"{os.getenv('PASSWORD_RESET_URL')}/{user.reset_token}"
    send_reset_email(user, reset_url)
    return jsonify({'message': 'Password reset email sent'}), 200


@auth_bp.route('/auth/reset-password/<token>', methods=['POST'])
def reset_password(token):
    user = User.query.filter_by(reset_token=token).first()
    if not user or user.token_expiry < datetime.now():
        return validation_error('Invalid or expired token')

    data = request.get_json()
    new_password = data['password']
    if not new_password:
        return validation_error('Password is required')

    user.password_hash = generate_password_hash(new_password)
    user.reset_token = None
    user.token_expiry = None
    db.session.commit()

    return jsonify({'message': 'Password reset successful'}), 200
