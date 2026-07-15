from typing import Any, List, Optional
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc
from datetime import datetime, timezone
from pydantic import BaseModel

from app.api import deps
from app.models.user import User, WalletTransaction, SupportTicket
from app.models.product import Product, DigitalAccount
from app.models.order import Order, OrderItem, OrderStatusEnum, PaymentMethodEnum
from app.schemas import UserResponse

router = APIRouter()

# ─── Schemas ────────────────────────────────────────────────────
class UpdateProfileIn(BaseModel):
    username: str
    email: str

class TopupWalletIn(BaseModel):
    amount: float

class WalletTransactionResponse(BaseModel):
    id: UUID
    amount: float
    tx_type: str
    description: Optional[str] = None
    created_at: Any

    class Config:
        from_attributes = True

class SupportTicketCreateIn(BaseModel):
    subject: str
    content: str

class SupportTicketResponse(BaseModel):
    id: UUID
    subject: str
    content: str
    status: str
    created_at: Any

    class Config:
        from_attributes = True

class CheckoutItem(BaseModel):
    product_id: UUID
    quantity: int

class CheckoutIn(BaseModel):
    items: List[CheckoutItem]
    payment_method: str  # VNPAY | MOMO | BANK_TRANSFER

# ─── Endpoints ──────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
async def read_portal_me(
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_portal_profile(
    profile_in: UpdateProfileIn,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    # Check email exists elsewhere
    if profile_in.email != current_user.email:
        email_check = await db.execute(
            select(User).where(User.email == profile_in.email)
        )
        if email_check.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email này đã được sử dụng")

    current_user.username = profile_in.username
    current_user.email = profile_in.email
    await db.commit()
    await db.refresh(current_user)
    return current_user

# ─── Wallet Transactions ────────────────────────────────────────
@router.get("/wallet/transactions", response_model=List[WalletTransactionResponse])
async def get_wallet_transactions(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    result = await db.execute(
        select(WalletTransaction)
        .where(WalletTransaction.user_id == current_user.id)
        .order_by(desc(WalletTransaction.created_at))
    )
    return result.scalars().all()

@router.post("/wallet/topup")
async def topup_wallet(
    topup_in: TopupWalletIn,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    if topup_in.amount <= 0:
        raise HTTPException(status_code=400, detail="Số tiền nạp phải lớn hơn 0")

    # Add balance
    current_user.balance = float(current_user.balance) + topup_in.amount
    
    # Create transaction
    tx = WalletTransaction(
        user_id=current_user.id,
        amount=topup_in.amount,
        tx_type="deposit",
        description="Nạp tiền thử nghiệm hệ thống"
    )
    db.add(tx)
    await db.commit()
    await db.refresh(current_user)
    return {"status": "ok", "new_balance": float(current_user.balance)}

# ─── Support Tickets ────────────────────────────────────────────
@router.get("/tickets", response_model=List[SupportTicketResponse])
async def get_support_tickets(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    result = await db.execute(
        select(SupportTicket)
        .where(SupportTicket.user_id == current_user.id)
        .order_by(desc(SupportTicket.created_at))
    )
    return result.scalars().all()

@router.post("/tickets", response_model=SupportTicketResponse)
async def create_support_ticket(
    ticket_in: SupportTicketCreateIn,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    ticket = SupportTicket(
        user_id=current_user.id,
        subject=ticket_in.subject,
        content=ticket_in.content,
        status="open"
    )
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return ticket

# ─── Checkout & Auto-delivery ──────────────────────────────────
@router.post("/orders/checkout")
async def portal_checkout(
    checkout_in: CheckoutIn,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    if not checkout_in.items:
        raise HTTPException(status_code=400, detail="Giỏ hàng trống")

    # 1. Calculate total price and verify stock
    total_price = 0.0
    items_to_process = []

    for item in checkout_in.items:
        product = (await db.execute(
            select(Product).where(Product.id == item.product_id)
        )).scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
        
        # Verify enough stock is available in DigitalAccount
        avail_accounts = (await db.execute(
            select(func.count(DigitalAccount.id))
            .where(DigitalAccount.product_id == product.id)
            .where(DigitalAccount.status == "available")
        )).scalar() or 0

        if avail_accounts < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Sản phẩm {product.name} đã hết hàng hoặc không đủ tồn kho. Tồn kho thực tế: {avail_accounts}"
            )

        price = float(product.sale_price or product.price)
        subtotal = price * item.quantity
        total_price += subtotal
        items_to_process.append((product, item.quantity, price, subtotal))

    # 2. Check wallet balance
    if float(current_user.balance) < total_price:
        raise HTTPException(
            status_code=400,
            detail=f"Số dư tài khoản không đủ để thanh toán. Cần {total_price:,.0f}đ, hiện có {float(current_user.balance):,.0f}đ. Vui lòng nạp thêm tiền!"
        )

    # 3. Deduct balance and create order
    current_user.balance = float(current_user.balance) - total_price

    # Form code
    order_code = f"DV-{str(uuid4())[:8].upper()}"

    # Determine payment method
    try:
        pay_method = PaymentMethodEnum(checkout_in.payment_method.upper())
    except ValueError:
        pay_method = PaymentMethodEnum.BANK_TRANSFER

    order = Order(
        user_id=current_user.id,
        total_amount=total_price,
        status=OrderStatusEnum.COMPLETED, # Autodelivered means COMPLETED immediately
        payment_method=pay_method,
        order_code=order_code
    )
    db.add(order)
    await db.flush() # get order.id

    # 4. Allocate accounts and bind OrderItems
    for product, qty, unit_price, subtotal in items_to_process:
        # Fetch available accounts
        acc_query = await db.execute(
            select(DigitalAccount)
            .where(DigitalAccount.product_id == product.id)
            .where(DigitalAccount.status == "available")
            .limit(qty)
        )
        accounts = acc_query.scalars().all()

        # Build credentials info string
        cred_lines = []
        for idx, acc in enumerate(accounts):
            acc.status = "sold"
            acc.sold_at = datetime.now(timezone.utc)
            two_factor_str = f" | 2FA: {acc.two_factor_code}" if acc.two_factor_code else ""
            cred_lines.append(f"Tài khoản #{idx+1}: {acc.email} | pass: {acc.password}{two_factor_str}")

        item_data = "\n".join(cred_lines)

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=qty,
            unit_price=unit_price,
            subtotal=subtotal,
            item_data=item_data
        )
        db.add(order_item)

        # Update product stock count
        product.stock_count = max(0, product.stock_count - qty)
        product.sold_count += qty

    # 5. Create spend WalletTransaction
    tx = WalletTransaction(
        user_id=current_user.id,
        amount=-total_price,
        tx_type="purchase",
        description=f"Thanh toán đơn hàng {order_code}"
    )
    db.add(tx)

    await db.commit()
    await db.refresh(order)
    return {
        "status": "ok",
        "order_code": order_code,
        "total_amount": total_price,
        "message": "Thanh toán thành công. Tài khoản số đã được gửi vào Thư viện số của bạn!"
    }

# Helper inside this module
from sqlalchemy import func
