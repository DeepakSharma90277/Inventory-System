from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Order, OrderItem, Product, Customer
from app.schemas.schemas import OrderCreate, OrderOut

router = APIRouter()


@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    # Validate customer exists
    customer = db.query(Customer).filter(Customer.id == order_data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    total = 0.0
    items_to_create = []

    # Validate all products and stock before making any changes
    for item in order_data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product ID {item.product_id} not found")
        if product.quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for '{product.name}'. Available: {product.quantity}, Requested: {item.quantity}"
            )
        total += product.price * item.quantity
        items_to_create.append((product, item.quantity, product.price))

    # Create order
    db_order = Order(customer_id=order_data.customer_id, total_amount=round(total, 2))
    db.add(db_order)
    db.flush()

    # Create order items and deduct stock
    for product, qty, unit_price in items_to_create:
        db_item = OrderItem(
            order_id=db_order.id,
            product_id=product.id,
            quantity=qty,
            unit_price=unit_price
        )
        db.add(db_item)
        product.quantity -= qty

    db.commit()
    db.refresh(db_order)
    return db_order


@router.get("", response_model=List[OrderOut])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Restore stock
    for item in order.items:
        item.product.quantity += item.quantity
    db.delete(order)
    db.commit()
