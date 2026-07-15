# -*- coding: utf-8 -*-
import io, sys
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
"""
Script setup/seed database: drop all tables, recreate, and insert mock data.
Run: python create_admin.py
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from app.config import settings
from app.database import Base
# Make sure all models are imported so SQLAlchemy knows them
from app.models import User, Category, Product, DigitalAccount, Order, OrderItem, WalletTransaction, SupportTicket
from app.models.user import RoleEnum
from app.core.security import get_password_hash

ADMIN_EMAIL    = "admin@shopdv.vn"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "Admin@123456"

CUSTOMER_EMAIL    = "customer@shopdv.vn"
CUSTOMER_USERNAME = "customer"
CUSTOMER_PASSWORD = "Customer@123456"

async def setup_db():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    print("[INFO] Dang thiet lap lai database...")
    async with engine.begin() as conn:
        # Drop all tables first to apply the new schema cleanly
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Recreated database tables successfully.")

    async with SessionLocal() as session:
        # 1. Create Admin
        admin = User(
            email=ADMIN_EMAIL,
            username=ADMIN_USERNAME,
            hashed_password=get_password_hash(ADMIN_PASSWORD),
            role=RoleEnum.ADMIN,
            is_active=True,
        )
        session.add(admin)

        # 2. Create a customer
        customer = User(
            email=CUSTOMER_EMAIL,
            username=CUSTOMER_USERNAME,
            hashed_password=get_password_hash(CUSTOMER_PASSWORD),
            role=RoleEnum.CUSTOMER,
            is_active=True,
            balance=500000.00
        )
        session.add(customer)

        # 3. Create Categories
        cat_ai = Category(name="Tài khoản AI", slug="tai-khoan-ai", description="Cac tai khoan Premium ve tri tue nhan tao", sort_order=1)
        cat_ent = Category(name="Giải trí", slug="giai-tri", description="Netflix, Spotify, Youtube Premium", sort_order=2)
        cat_study = Category(name="Học tập", slug="hoc-tap", description="Canva, Zoom, Microsoft 365", sort_order=3)
        session.add_all([cat_ai, cat_ent, cat_study])
        await session.flush() # get IDs

        # 4. Create Products
        p1 = Product(
            category_id=cat_ai.id,
            name="ChatGPT Plus (GPT-4o)",
            slug="chatgpt-plus",
            description="Tai khoan ChatGPT Plus chinh chu gia han hang thang",
            short_desc="GPT-4o, DALL-E 3, phan tich du lieu nang cao",
            price=199000,
            sale_price=159000,
            product_type="account",
            delivery_type="auto",
            stock_count=5,
            is_featured=True
        )
        p2 = Product(
            category_id=cat_ent.id,
            name="Netflix Premium 4K",
            slug="netflix-premium",
            description="Netflix Premium ho tro chat luong xem phim 4K HDR",
            short_desc="Xem phim chat luong cao, 1 profile rieng",
            price=79000,
            sale_price=59000,
            product_type="account",
            delivery_type="auto",
            stock_count=3,
            is_featured=True
        )
        p3 = Product(
            category_id=cat_study.id,
            name="Canva Pro 1 năm",
            slug="canva-pro",
            description="Canva Pro thiet ke do hoa nang cao, kho mau khong gioi han",
            short_desc="Thiet ke an tuong de dang voi Canva Pro",
            price=99000,
            product_type="account",
            delivery_type="auto",
            stock_count=4,
            is_featured=True
        )
        session.add_all([p1, p2, p3])
        await session.flush()

        # 5. Create Digital Accounts (Inventory)
        # For ChatGPT
        for i in range(5):
            acc = DigitalAccount(
                product_id=p1.id,
                email=f"chatgpt_sub{i+1}@shopdv.vn",
                password=f"ChatGPT@{i}23",
                status="available",
                purchase_price=90000.00
            )
            session.add(acc)

        # For Netflix
        for i in range(3):
            acc = DigitalAccount(
                product_id=p2.id,
                email=f"netflix_sub{i+1}@shopdv.vn",
                password=f"NetPass{i}89",
                status="available",
                purchase_price=35000.00
            )
            session.add(acc)

        # For Canva
        for i in range(4):
            acc = DigitalAccount(
                product_id=p3.id,
                email=f"canva_sub{i+1}@shopdv.vn",
                password=f"CanvaPass{i}55",
                status="available",
                purchase_price=45000.00
            )
        # 6. Create Wallet Transactions for Customer
        tx1 = WalletTransaction(
            user_id=customer.id,
            amount=500000.00,
            tx_type="deposit",
            description="Nạp tiền hệ thống kích hoạt tài khoản"
        )
        session.add(tx1)

        # 7. Create Support Ticket for Customer
        ticket = SupportTicket(
            user_id=customer.id,
            subject="Cần hỗ trợ đổi mật khẩu Netflix",
            content="Mật khẩu tài khoản Netflix nhận được bị báo sai, nhờ admin kiểm tra giúp.",
            status="pending"
        )
        session.add(ticket)

        await session.commit()
        print("[OK] Seeding complete! Database setup successful.")
        print(f"   Admin: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
        print(f"   Customer: {CUSTOMER_EMAIL} / {CUSTOMER_PASSWORD}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(setup_db())
