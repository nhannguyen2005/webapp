import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Numeric, Integer, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String(255), nullable=True)
    parent_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    short_desc = Column(String(500), nullable=True)
    price = Column(Numeric(12, 2), nullable=False)
    sale_price = Column(Numeric(12, 2), nullable=True)
    thumbnail = Column(String(255), nullable=True)
    images = Column(JSON, default=list, nullable=False)
    product_type = Column(String(50), default="account", nullable=False)
    delivery_type = Column(String(50), default="auto", nullable=False)
    stock_count = Column(Integer, default=0, nullable=False)
    sold_count = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    avg_rating = Column(Numeric(3, 2), default=5.0, nullable=True)
    review_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    digital_accounts = relationship("DigitalAccount", back_populates="product", cascade="all, delete-orphan")

class DigitalAccount(Base):
    __tablename__ = "digital_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    email = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    two_factor_code = Column(String(255), nullable=True)
    recovery_email = Column(String(255), nullable=True)
    recovery_code = Column(String(255), nullable=True)
    cookies = Column(Text, nullable=True)
    token = Column(Text, nullable=True)
    license_key = Column(String(255), nullable=True)
    expiry_date = Column(DateTime(timezone=True), nullable=True)
    supplier = Column(String(255), nullable=True)
    purchase_price = Column(Numeric(12, 2), nullable=True)
    status = Column(String(50), default="available", nullable=False)  # available, sold, expired, disabled
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    sold_at = Column(DateTime(timezone=True), nullable=True)

    product = relationship("Product", back_populates="digital_accounts")
