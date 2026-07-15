from fastapi import APIRouter

from .auth import router as auth_router
from .products import router as products_router
from .orders import router as orders_router
from .admin import router as admin_router
from .portal import router as portal_router
from .payments import router as payments_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(products_router, prefix="/products", tags=["products"])
api_router.include_router(orders_router, prefix="/orders", tags=["orders"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])
api_router.include_router(portal_router, prefix="/portal", tags=["portal"])
api_router.include_router(payments_router, prefix="/payments", tags=["payments"])
