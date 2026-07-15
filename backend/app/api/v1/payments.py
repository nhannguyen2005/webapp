import uuid
import time
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.api.deps import get_current_user
from app.models.user import User, DepositRequest, WalletTransaction
from app.config import settings

# If payos is installed
try:
    from payos import PayOS, ItemData, PaymentData
    payos = PayOS(
        client_id=settings.PAYOS_CLIENT_ID,
        api_key=settings.PAYOS_API_KEY,
        checksum_key=settings.PAYOS_CHECKSUM_KEY
    )
except ImportError:
    payos = None

router = APIRouter()

class DepositRequestCreate(BaseModel):
    amount: float
    payment_method: str # 'payos', 'momo', 'manual_bank'

class ManualDepositConfirm(BaseModel):
    order_code: int

@router.post("/create-payment-link")
async def create_payment_link(
    data: DepositRequestCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Create a payment link for automatic bank transfer via PayOS, or generate a manual request.
    """
    if data.amount < 10000:
        raise HTTPException(status_code=400, detail="Minimum amount is 10,000 VND")
    
    # Generate unique order code (PayOS requires an integer up to 53 bits)
    # Using timestamp in ms
    order_code = int(time.time() * 1000)
    
    # Create DepositRequest record
    deposit_req = DepositRequest(
        user_id=current_user.id,
        order_code=order_code,
        amount=data.amount,
        payment_method=data.payment_method
    )
    db.add(deposit_req)
    await db.commit()
    await db.refresh(deposit_req)

    if data.payment_method == "payos":
        if not payos or not settings.PAYOS_CLIENT_ID:
            raise HTTPException(status_code=500, detail="PayOS is not configured")
        
        # Create PayOS payment link
        domain = "http://localhost:5173" # Update to frontend domain in production
        item = ItemData(name="Nap tien Wallet", quantity=1, price=int(data.amount))
        payment_data = PaymentData(
            orderCode=order_code,
            amount=int(data.amount),
            description=f"Nap tien {current_user.username}",
            items=[item],
            cancelUrl=f"{domain}/deposit/cancel",
            returnUrl=f"{domain}/deposit/success"
        )
        
        try:
            payos_res = payos.createPaymentLink(payment_data)
            return {
                "message": "Payment link created successfully",
                "payment_url": payos_res.checkoutUrl,
                "qr_code": payos_res.qrCode,
                "order_code": order_code
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    elif data.payment_method in ["momo", "manual_bank"]:
        # Return information for manual transfer
        return {
            "message": "Manual deposit request created",
            "order_code": order_code,
            "amount": data.amount,
            "transfer_syntax": f"NAP {order_code}"
        }
        
    raise HTTPException(status_code=400, detail="Unsupported payment method")

@router.post("/payos-webhook")
async def payos_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Webhook to receive payment confirmation from PayOS
    """
    body = await request.json()
    
    # In production, verify the webhook signature!
    # payos.verifyPaymentWebhookData(body)
    
    data = body.get("data", {})
    order_code = data.get("orderCode")
    code = body.get("code")
    
    if code == "00" and order_code:
        # Find deposit request
        stmt = select(DepositRequest).where(DepositRequest.order_code == order_code)
        result = await db.execute(stmt)
        deposit_req = result.scalar_one_or_none()
        
        if deposit_req and deposit_req.status == "pending":
            # Update status
            deposit_req.status = "success"
            
            # Find user and add balance
            stmt_user = select(User).where(User.id == deposit_req.user_id)
            user_res = await db.execute(stmt_user)
            user = user_res.scalar_one_or_none()
            
            if user:
                user.balance += deposit_req.amount
                
                # Record transaction
                tx = WalletTransaction(
                    user_id=user.id,
                    amount=deposit_req.amount,
                    tx_type="deposit",
                    description=f"Nap tien tu dong PayOS - Code {order_code}"
                )
                db.add(tx)
                
            await db.commit()
            return {"success": True, "message": "Payment processed"}
            
    return {"success": True, "message": "Webhook received"}
