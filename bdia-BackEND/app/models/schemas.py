from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TransactionInput(BaseModel):
    customer_id: int
    customer_name: str
    gender: str
    age: int
    state: str
    city: str
    bank_branch: Optional[str] = None
    account_type: Optional[str] = None
    transaction_id: str  # Changé en str pour correspondre à TransactionGenerator
    transaction_date: datetime
    transaction_time: str
    transaction_amount: float
    merchant_id: int
    transaction_type: str
    merchant_category: Optional[str] = None
    account_balance: float
    transaction_device: Optional[str] = None
    transaction_location: str
    device_type: Optional[str] = None
    transaction_currency: str
    customer_contact: Optional[str] = None
    transaction_description: Optional[str] = None
    customer_email: Optional[str] = None
    banque_id: int  # Changé en int pour correspondre au modèle Transaction
    user_id: str
    transaction_category: str  # Remplace l'ancien usage de transaction_category
    balance_change: float
    is_new_user: int

    class Config:
        orm_mode = True