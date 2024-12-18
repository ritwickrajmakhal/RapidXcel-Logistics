import os
from flask import Flask, render_template
from flask_cors import CORS
from .db import db, init_app as init_db
from . import commands

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config.from_mapping(
        SECRET_KEY='dev',
        SQLALCHEMY_DATABASE_URI=f"sqlite:///{os.path.join(app.instance_path, 'rapidxcel_logistics.sqlite')}",
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
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
    
    # register blueprints
    from .apis import order
    app.register_blueprint(order.bp)
    
    # A simple route for testing
    @app.route("/")
    def index():
        return render_template("index.html")
    
    return app

from . import models