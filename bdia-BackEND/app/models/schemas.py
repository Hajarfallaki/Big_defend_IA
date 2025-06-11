# app/models/schemas.py
from pydantic import BaseModel
from datetime import datetime

# app/models/schemas.py
from pydantic import BaseModel
from datetime import datetime

class TransactionInput(BaseModel):
    transaction_id: int
    user_id: int
    transaction_amount: float
    transaction_type: str
    timestamp: datetime
    account_balance: float
    device_type: str
    location: str
    merchant_category: str
    ip_address_flag: int
    previous_fraudulent_activity: int
    daily_transaction_count: int
    avg_transaction_amount_7d: float
    failed_transaction_count_7d: int
    card_type: str
    card_age: int
    transaction_distance: float
    authentication_method: str
    risk_score: float
    is_weekend: bool
