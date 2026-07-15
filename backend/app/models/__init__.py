from app.database import Base
from app.models.user import User, WalletTransaction, SupportTicket
from app.models.product import Category, Product, DigitalAccount
from app.models.order import Order, OrderItem

# This file imports all models so Alembic can discover them
__all__ = ["Base", "User", "WalletTransaction", "SupportTicket", "Category", "Product", "DigitalAccount", "Order", "OrderItem"]
