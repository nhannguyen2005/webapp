import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.ext.asyncio import create_async_engine
from app.config import settings
from app.database import Base
# Import all models to ensure they are registered with Base.metadata
from app.models.user import User, WalletTransaction, SupportTicket, DepositRequest
from app.models.product import Category, Product, DigitalAccount
from app.models.order import Order, OrderItem

async def create_new_tables():
    engine = create_async_engine(settings.async_database_url, echo=True)
    async with engine.begin() as conn:
        print("Running create_all to create any missing tables...")
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
    print("Done!")

if __name__ == "__main__":
    asyncio.run(create_new_tables())
