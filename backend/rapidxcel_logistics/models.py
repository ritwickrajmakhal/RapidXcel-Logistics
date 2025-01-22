from . import db
from flask_login import UserMixin
import uuid
from datetime import datetime, timedelta

# User Table
class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('Inventory Manager', 'Customer', 'Supplier', 'Courier Service', name='user_roles'), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    reset_token = db.Column(db.String(255), nullable=True)
    token_expiry = db.Column(db.DateTime, nullable=True)
    
    orders = db.relationship('Order', back_populates='customer', lazy=True, foreign_keys='Order.customer_id')
    couriers = db.relationship('Order', back_populates='courier', lazy=True, foreign_keys='Order.courier_id')
    
    def to_dict(self):
        """Convert the User instance into a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'phone_number': self.phone_number if self.phone_number else None,
            'address': self.address if self.address else None,
        }
    
    def generate_reset_token(self):
        self.reset_token = str(uuid.uuid4())
        self.token_expiry = datetime.now() + timedelta(hours=1)

# Stock Table
class Stock(db.Model):
    __tablename__ = 'stocks'

    stock_id = db.Column(db.Integer, primary_key=True)
    stock_name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f"<Stock {self.stock_name}>"
    
    def to_dict(self):
        """Convert the Stock instance into a dictionary."""
        return {
            'stock_id': self.stock_id,
            'stock_name': self.stock_name,
            'price': self.price,
            'quantity': self.quantity,
            'weight': self.weight,
        }

# Orders Table
class Order(db.Model):
    __tablename__ = 'orders'  # Name of the table in the database

    id = db.Column(db.Integer, primary_key=True)  # Order ID
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Customer ID
    shipping_address = db.Column(db.String(255), nullable=False)  # Shipping Address
    pin_code = db.Column(db.String(10), nullable=False)  # Pin Code
    phone_number = db.Column(db.String(15), nullable=False)  # Phone Number
    consignment_weight = db.Column(db.Float, nullable=False)  # Weight of the consignment
    shipping_cost = db.Column(db.Float, nullable=False)  # Shipping cost
    delivery_date = db.Column(db.DateTime, nullable=False)  # Delivery date
    status = db.Column(db.Enum('Processing', 'In Transit', 'Delivered', name='order_status'), default='Processing')  # Order status
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())  # Created timestamp
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())  # Updated timestamp
    courier_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Courier ID
    
    customer = db.relationship('User', back_populates='orders', lazy=True, foreign_keys=[customer_id])
    order_items = db.relationship('OrderItem', back_populates='order', lazy=True)
    courier = db.relationship('User', back_populates='couriers', lazy=True, foreign_keys=[courier_id])
    
    def to_dict(self):
        """Convert the Order instance into a dictionary."""
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'shipping_address': self.shipping_address,
            'pin_code': self.pin_code,
            'phone_number': self.phone_number,
            'consignment_weight': self.consignment_weight,
            'shipping_cost': self.shipping_cost,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'status': self.status,
            'courier_id': self.courier_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'order_items': [order_item.to_dict() for order_item in self.order_items],
        }

# Order Items Table
class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('stocks.stock_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)

    order = db.relationship('Order', back_populates='order_items')
    
    def to_dict(self):
        """Convert the OrderItem instance into a dictionary."""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'weight': self.weight,
            'price': self.price,
        }