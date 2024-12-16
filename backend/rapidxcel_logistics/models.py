from . import db
from datetime import datetime

# User Table
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('Inventory Manager', 'Customer', 'Supplier', 'Courier Service', name='user_roles'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    orders = db.relationship('Order', back_populates='customer', lazy=True)
    couriers = db.relationship('Courier', back_populates='courier', lazy=True)
    suppliers = db.relationship('Supplier', back_populates='user', lazy=True)

# Inventory Table
class Inventory(db.Model):
    __tablename__ = 'inventory'

    id = db.Column(db.Integer, primary_key=True)
    stock_name = db.Column(db.String(255), nullable=False)
    stock_id = db.Column(db.String(255), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order_items = db.relationship('OrderItem', back_populates='inventory', lazy=True)
    supply_orders = db.relationship('SupplyOrder', back_populates='inventory', lazy=True)

# Orders Table
class Order(db.Model):
    __tablename__ = 'orders'  # Name of the table in the database

    id = db.Column(db.Integer, primary_key=True)  # Order ID
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Customer ID
    shipping_address = db.Column(db.String(255), nullable=False)  # Shipping Address
    consignment_weight = db.Column(db.Float, nullable=False)  # Weight of the consignment
    shipping_cost = db.Column(db.Float, nullable=False)  # Shipping cost
    status = db.Column(db.Enum('Processing', 'In Transit', 'Delivered', name='order_status'), default='Processing')  # Order status
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())  # Created timestamp
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())  # Updated timestamp
    
    customer = db.relationship('User', back_populates='orders')
    order_items = db.relationship('OrderItem', back_populates='order', lazy=True)
    courier = db.relationship('Courier', back_populates='order', uselist=False)
     
    def __repr__(self):
        return f'<Order {self.id}>'

# Order Items Table
class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    item_cost = db.Column(db.Float, nullable=False)

    order = db.relationship('Order', back_populates='order_items')
    inventory = db.relationship('Inventory', back_populates='order_items')

# Courier Table
class Courier(db.Model):
    __tablename__ = 'courier'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    courier_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('Processing', 'In Transit', 'Delivered', 'Issue', name='courier_status'), default='Processing')
    issue_description = db.Column(db.Text)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order = db.relationship('Order', back_populates='courier')
    courier = db.relationship('User', back_populates='couriers')
    
    def to_dict(self):
        """Convert the Courier instance into a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'address': self.address,
            'order_id': self.order_id,
            'courier_id': self.courier_id,
            'status': self.status,
            'issue_description': self.issue_description,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

# Supplier Table
class Supplier(db.Model):
    __tablename__ = 'suppliers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='suppliers')
    supply_orders = db.relationship('SupplyOrder', back_populates='supplier', lazy=True)

# Supply Orders Table
class SupplyOrder(db.Model):
    __tablename__ = 'supply_orders'

    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_cost = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum('Processing', 'Dispatched', 'Delayed', 'Received', name='supply_order_status'), default='Processing')
    expected_delivery_date = db.Column(db.DateTime)

    supplier = db.relationship('Supplier', back_populates='supply_orders')
    inventory = db.relationship('Inventory', back_populates='supply_orders')
