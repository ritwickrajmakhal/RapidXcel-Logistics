from . import db
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='notifications')
    
# User Table
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('Inventory Manager', 'Customer', 'Supplier', 'Courier Service', name='user_roles'), nullable=False)

    orders = db.relationship('Order', back_populates='customer', lazy=True, foreign_keys='Order.customer_id')
    couriers = db.relationship('Order', back_populates='courier', lazy=True, foreign_keys='Order.courier_id')
    suppliers = db.relationship('Supplier', back_populates='user', lazy=True)
    notifications = db.relationship('Notification', back_populates='user', lazy=True)
    
    def to_dict(self):
        """Convert the User instance into a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

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
    delivery_date = db.Column(db.DateTime, nullable=True)  # Delivery date
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
            'consignment_weight': self.consignment_weight,
            'shipping_cost': self.shipping_cost,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'status': self.status,
            'courier_id': self.courier_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'order_items': [order_item.to_dict() for order_item in self.order_items],
        }
    
    def update_status(self, new_status):
        """Update the status of the order and create a notification."""
        self.status = new_status
        db.session.commit()
        notification = Notification(
            user_id=self.customer_id,
            message=f"Your order {self.id} status has been updated to {new_status}."
        )
        db.session.add(notification)
        db.session.commit()

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