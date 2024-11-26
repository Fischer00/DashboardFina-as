from pydantic import BaseModel
from datetime import date

class Transaction(BaseModel):
    amount: float
    category: str
    date: str
    description: str
    type: str

class TransactionResponse(Transaction):
    id: int