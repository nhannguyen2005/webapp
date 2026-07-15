from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.models.product import Product, Category
from app.schemas import ProductResponse, ProductCreate

router = APIRouter()


@router.get("/", response_model=List[ProductResponse])
async def read_products(
    db: AsyncSession = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve products.
    """
    from sqlalchemy.orm import selectinload
    result = await db.execute(select(Product).options(selectinload(Product.category)).offset(skip).limit(limit))
    products = result.scalars().all()
    # The current schema has more fields, but we will return what matches.
    # Note: Pydantic from_attributes=True will ignore missing attributes if they are Optional 
    # but since our ProductResponse has some non-optional fields we might need to be careful
    # For now, it will return the base models
    return products

@router.post("/", response_model=ProductResponse)
async def create_product(
    *,
    db: AsyncSession = Depends(deps.get_db),
    product_in: ProductCreate,
) -> Any:
    """
    Create new product.
    """
    product = Product(
        name=product_in.name,
        slug=product_in.slug,
        description=product_in.description,
        price=product_in.price,
        sale_price=product_in.sale_price,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product

@router.get("/{slug}", response_model=ProductResponse)
async def read_product_by_slug(
    slug: str,
    db: AsyncSession = Depends(deps.get_db),
) -> Any:
    from sqlalchemy.orm import selectinload
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.slug == slug)
    )
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product
