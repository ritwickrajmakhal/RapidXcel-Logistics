import os
from flask import Flask, render_template
from flask_cors import CORS
from .db import db, init_app as init_db
from . import commands
from flask_login import LoginManager
from flask_principal import Principal, Permission, RoleNeed
from flask_mail import Mail

login_manager = LoginManager()
principals = Principal()
mail = Mail()

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {"origins": "*"},
        r"/auth/*": {"origins": "*"}
    })
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY', 'dev'),
        SQLALCHEMY_DATABASE_URI=os.getenv('SQLALCHEMY_DATABASE_URI', f"sqlite:///{os.path.join(app.instance_path, 'rapidxcel_logistics.sqlite')}"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SESSION_COOKIE_SAMESITE='None',
        SESSION_COOKIE_SECURE=True,
        MAIL_SERVER=os.getenv('MAIL_SERVER', 'smtp.gmail.com'),
        MAIL_PORT=int(os.getenv('MAIL_PORT', 587)),
        MAIL_USERNAME=os.getenv('MAIL_USERNAME', 'your_email@example.com'),
        MAIL_PASSWORD=os.getenv('MAIL_PASSWORD', 'your_email_password'),
        MAIL_USE_TLS=os.getenv('MAIL_USE_TLS', 'True').lower() in ['true', '1', 't'],
        MAIL_USE_SSL=os.getenv('MAIL_USE_SSL', 'False').lower() in ['true', '1', 't']
    )
    
    if test_config is None:
        # Load the instance config, if it exists
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config
        app.config.from_mapping(test_config)
    
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Initialize database
    init_db(app)
    
    # Register commands
    commands.init_app(app)
    
    # Initialize plugins
    login_manager.init_app(app)
    principals.init_app(app)
    mail.init_app(app)
    
    # register blueprints
    from .apis import order, supplier, auth, stock, analytics
    app.register_blueprint(order.bp)
    app.register_blueprint(supplier.supplier_bp)
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(stock.stock_bp)
    app.register_blueprint(analytics.analytics_bp)
    
    # A simple route for testing
    @app.route("/")
    def index():
        return render_template("index.html")
    
    return app

from . import models