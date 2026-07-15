from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
import uuid


# ─── Auth Schemas ─────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)
    full_name: Optional[str] = None
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenRefresh(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: str
    is_active: bool
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}

    # Provide defaults for columns not present in the DB model
    @classmethod
    def model_validate(cls, obj, *args, **kwargs):
        if not isinstance(obj, dict):
            data = {
                "id": obj.id,
                "email": obj.email,
                "username": obj.username,
                "role": obj.role,
                "is_active": obj.is_active,
                "created_at": obj.created_at,
                "full_name": getattr(obj, "full_name", None),
                "phone": getattr(obj, "phone", None),
                "avatar_url": getattr(obj, "avatar_url", None),
            }
            return super().model_validate(data, *args, **kwargs)
        return super().model_validate(obj, *args, **kwargs)


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None


class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


# ─── Category Schemas ─────────────────────────────────────────────────────────

class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    slug: str = Field(..., max_length=100)
    description: Optional[str] = None
    icon_url: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: int = 0


class CategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    parent_id: Optional[int] = None
    sort_order: int
    is_active: bool

    class Config:
        from_attributes = True


# ─── Product Schemas ──────────────────────────────────────────────────────────

class ProductCreate(BaseModel):
    category_id: Optional[int] = None
    name: str = Field(..., max_length=255)
    slug: str = Field(..., max_length=255)
    description: Optional[str] = None
    short_desc: Optional[str] = Field(None, max_length=500)
    price: float = Field(..., gt=0)
    sale_price: Optional[float] = None
    thumbnail: Optional[str] = None
    images: List[str] = []
    product_type: str = "account"
    delivery_type: str = "auto"
    is_featured: bool = False
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None


class ProductUpdate(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    short_desc: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    thumbnail: Optional[str] = None
    images: Optional[List[str]] = None
    product_type: Optional[str] = None
    delivery_type: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    meta_title: Optional[str] = None
    meta_desc: Optional[str] = None


class ProductResponse(BaseModel):
    id: uuid.UUID
    category_id: Optional[int] = None
    category: Optional[CategoryResponse] = None
    name: str
    slug: str
    description: Optional[str] = None
    short_desc: Optional[str] = None
    price: float
    sale_price: Optional[float] = None
    thumbnail: Optional[str] = None
    images: List[str] = []
    product_type: str
    delivery_type: str
    stock_count: int
    sold_count: int
    is_active: bool
    is_featured: bool
    avg_rating: Optional[float] = None
    review_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    size: int
    pages: int


# ─── Cart Schemas ─────────────────────────────────────────────────────────────

class CartItemAdd(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(1, ge=1, le=10)


class CartItemUpdate(BaseModel):
    quantity: int = Field(..., ge=1, le=10)


class CartItemResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    product: ProductResponse
    quantity: int

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_items: int
    total_price: float


# ─── Order Schemas ────────────────────────────────────────────────────────────

class OrderCreate(BaseModel):
    payment_method: str = Field(..., description="vnpay | momo | bank_transfer")
    notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: uuid.UUID
    product_id: Optional[uuid.UUID] = None
    product_name: str
    quantity: int
    unit_price: float
    item_data: Optional[str] = None

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: uuid.UUID
    order_code: str
    status: str
    total_amount: float
    payment_method: Optional[str] = None
    payment_status: str
    payment_ref: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    size: int


# ─── Review Schemas ───────────────────────────────────────────────────────────

class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    user: UserResponse
    rating: int
    comment: Optional[str] = None
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Admin Schemas ────────────────────────────────────────────────────────────

class DashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    total_products: int
    total_users: int
    pending_orders: int
    today_revenue: float
    today_orders: int


class ProductItemCreate(BaseModel):
    item_data: str


class ProductItemBulkCreate(BaseModel):
    items: List[str]  # list of key/account strings


class OrderStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None


# ─── Pagination ───────────────────────────────────────────────────────────────

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)
