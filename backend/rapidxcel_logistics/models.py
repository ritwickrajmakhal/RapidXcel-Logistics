from . import db
from flask_login import UserMixin
import uuid
from datetime import datetime, timedelta
from sqlalchemy import CheckConstraint

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
    couriers = db.relationship('Order', back_populates='courier', lazy=True, foreign_keys='Order.courier_service_id')
    notifications = db.relationship('Notification', back_populates='user', lazy=True, cascade='all, delete-orphan')
    products = db.relationship('Product', back_populates='user', lazy=True, cascade='all, delete-orphan')
    replenishment_orders = db.relationship('ReplenishmentOrder', back_populates='inventory_manager', lazy=True, cascade='all, delete-orphan', foreign_keys='ReplenishmentOrder.inventory_manager_id')
    supply_orders = db.relationship('ReplenishmentOrder', back_populates='supplier', lazy=True, cascade='all, delete-orphan', foreign_keys='ReplenishmentOrder.supplier_id')
    stocks = db.relationship('Stock', back_populates='inventory_manager', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert the User instance into a dictionary."""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'phone_number': self.phone_number if self.phone_number else None,
            'address': self.address if self.address else None,
            'notifications': [notification.to_dict() for notification in self.notifications],
            'products': [product.to_dict() for product in self.products],
            'replenishment_orders': [order.to_dict() for order in self.replenishment_orders],
            'supply_orders': [order.to_dict() for order in self.supply_orders],
            'stocks': [stock.to_dict() for stock in self.stocks],
        }
    
    def generate_reset_token(self):
        self.reset_token = str(uuid.uuid4())
        self.token_expiry = datetime.now() + timedelta(hours=1)

# Stock Table
class Stock(db.Model):
    __tablename__ = 'stocks'

    stock_id = db.Column(db.Integer, primary_key=True)
    inventory_manager_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    stock_name = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)

    # relationships
    inventory_manager = db.relationship('User', back_populates='stocks', lazy=True)
    
    # constraints
    __table_args__ = (
        CheckConstraint('quantity >= 0', name='check_quantity_non_negative'),
    )

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

# Customer's Orders Table
class Order(db.Model):
    __tablename__ = 'orders'  # Name of the table in the database

    id = db.Column(db.Integer, primary_key=True)  # Order ID
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Customer ID
    courier_service_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # Courier ID
    shipping_address = db.Column(db.String(255), nullable=False)  # Shipping Address
    pin_code = db.Column(db.String(10), nullable=False)  # Pin Code
    phone_number = db.Column(db.String(15), nullable=False)  # Phone Number
    consignment_weight = db.Column(db.Float, nullable=False)  # Weight of the consignment
    shipping_cost = db.Column(db.Float, nullable=False)  # Shipping cost
    delivery_date = db.Column(db.DateTime, nullable=False)  # Delivery date
    status = db.Column(db.Enum('Processing', 'In Transit', 'Delivered', name='order_status'), default='Processing')  # Order status
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())  # Created timestamp
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())  # Updated timestamp
    
    customer = db.relationship('User', back_populates='orders', lazy=True, foreign_keys=[customer_id])
    order_items = db.relationship('OrderItem', back_populates='order', lazy=True)
    courier = db.relationship('User', back_populates='couriers', lazy=True, foreign_keys=[courier_service_id])

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
            'courier_service_id': self.courier_service_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'order_items': [order_item.to_dict() for order_item in self.order_items],
        }

# Order Items Table for Customer's Orders Table
class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    stock_id = db.Column(db.Integer, db.ForeignKey('stocks.stock_id'), nullable=False)
    product_name = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)

    order = db.relationship('Order', back_populates='order_items')
    
    # constraints
    __table_args__ = (
        CheckConstraint('quantity >= 0', name='check_quantity_non_negative'),
    )

    def to_dict(self):
        """Convert the OrderItem instance into a dictionary."""
        return {
            'id': self.id,
            'order_id': self.order_id,
            'stock_id': self.stock_id,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'weight': self.weight,
            'price': self.price,
        }
        
# Notifications Table for Customer
class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='notifications')
    
    def to_dict(self):
        """Convert the Notification instance into a dictionary."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
      
# Supplier's Products  
class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    supplier_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', back_populates='products')
    replenishment_order_items = db.relationship('ReplenishmentOrderItem', back_populates='product', lazy=True, cascade='all, delete-orphan')

    # constraints
    __table_args__ = (
        CheckConstraint('quantity >= 0', name='check_quantity_non_negative'),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "supplier_id": self.supplier_id,
            "name": self.name,
            "price": self.price,
            "weight": self.weight,
            "quantity": self.quantity
        }

# Replenishment Orders Table
class ReplenishmentOrder(db.Model):
    __tablename__ = 'replenishment_orders'

    id = db.Column(db.Integer, primary_key=True)
    inventory_manager_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('Order Recieved', 'Processing', 'In Transit', 'Delivered', 'Delayed', 'Canceled', name='order_status'), default='Order Recieved')
    address = db.Column(db.String(255), nullable=True)
    mobile_number = db.Column(db.String(15), nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    expected_delivery_time = db.Column(db.DateTime, nullable=True) 
    
    # Relationships
    inventory_manager = db.relationship('User', foreign_keys=[inventory_manager_id], back_populates='replenishment_orders')
    supplier = db.relationship('User', foreign_keys=[supplier_id], back_populates='supply_orders')
    order_items = db.relationship('ReplenishmentOrderItem', back_populates='order', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            "id": self.id,
            "status": self.status,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "updated_at": self.updated_at.strftime("%Y-%m-%d %H:%M:%S"),
            "expected_delivery_time": self.expected_delivery_time.strftime("%Y-%m-%d %H:%M:%S") if self.expected_delivery_time else None,
            "address": self.address,
            "mobile_number": self.mobile_number,
            "order_items": [order_item.to_dict() for order_item in self.order_items],
        }
        
class ReplenishmentOrderItem(db.Model):
    __tablename__ = 'replenishment_order_items'

    id = db.Column(db.Integer, primary_key=True)
    replenishment_order_id = db.Column(db.Integer, db.ForeignKey('replenishment_orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    product_name = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)

    order = db.relationship('ReplenishmentOrder', back_populates='order_items')
    product = db.relationship('Product', back_populates='replenishment_order_items')
    
    # constraints
    __table_args__ = (
        CheckConstraint('quantity >= 0', name='check_quantity_non_negative'),
    )

    def to_dict(self):
        """Convert the OrderItem instance into a dictionary."""
        return {
            'id': self.id,
            'replenishment_order_id': self.replenishment_order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'weight': self.weight,
            'price': self.price,
        }