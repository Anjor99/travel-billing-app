from pydantic import BaseModel
from typing import Optional
from datetime import date

class CreateBillRequest(BaseModel):

    # Customer
    customer_name: str
    customer_phone: Optional[str] = None

    # Vehicle
    vehicle_no: Optional[str] = None

    # Trip
    source: Optional[str] = None
    destination: Optional[str] = None

    total_km: float
    rate_per_km: float

    per_day_km: float = 0
    total_nights: float = 0
    toll_tax_parking: float = 0

    is_return: bool = False
    
    # Bill
    bill_date: date