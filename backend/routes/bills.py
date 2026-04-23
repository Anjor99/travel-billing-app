from fastapi import APIRouter, Depends
from database import get_connection
from utils.dependencies import get_current_user
from schemas.bill_schema import CreateBillRequest

router = APIRouter(
    prefix="/bills",
    tags=["Bills"]
)

@router.post("/")
def create_bill(
    payload: CreateBillRequest,
    user_id: int = Depends(get_current_user)
):

    conn = get_connection()
    cursor = conn.cursor()

    # Extract payload
    customer_name = payload.customer_name
    customer_phone = payload.customer_phone
    vehicle_no = payload.vehicle_no

    source = payload.source
    destination = payload.destination

    total_km = payload.total_km
    rate_per_km = payload.rate_per_km

    per_day_km = payload.per_day_km
    total_nights = payload.total_nights
    toll_tax_parking = payload.toll_tax_parking

    is_return = payload.is_return

    # Step 1: Create customer
    cursor.execute(
        """
        INSERT INTO customers (
            name,
            phone,
            user_id
        )
        VALUES (%s, %s, %s)
        RETURNING id
        """,
        (
            customer_name,
            customer_phone,
            user_id
        )
    )

    customer_id = cursor.fetchone()[0]

    # Step 2: Create vehicle
    vehicle_id = None

    if vehicle_no:

        cursor.execute(
            """
            INSERT INTO vehicles (
                vehicle_no,
                user_id
            )
            VALUES (%s, %s)
            RETURNING id
            """,
            (
                vehicle_no,
                user_id
            )
        )

        vehicle_id = cursor.fetchone()[0]

    # Step 3: Create trip
    cursor.execute(
        """
        INSERT INTO trips (
            user_id,
            source,
            destination,
            total_km,
            rate_per_km,
            per_day_km,
            total_nights,
            toll_tax_parking,
            is_return
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        RETURNING id
        """,
        (
            user_id,
            source,
            destination,
            total_km,
            rate_per_km,
            per_day_km,
            total_nights,
            toll_tax_parking,
            is_return
        )
    )

    trip_id = cursor.fetchone()[0]

    # Step 4: Generate bill number
    cursor.execute(
        """
        SELECT COALESCE(MAX(bill_no), 0) + 1
        FROM bills
        WHERE user_id = %s
        """,
        (user_id,)
    )

    bill_no = cursor.fetchone()[0]
    bill_date = payload.bill_date

    # Step 5: Calculate total amount
    trip_amount = total_km * rate_per_km

    total_amount = (
        trip_amount
        + toll_tax_parking
        + total_nights
    )

    # Step 6: Create bill
    cursor.execute(
        """
        INSERT INTO bills (
            user_id,
            customer_id,
            vehicle_id,
            trip_id,
            total_amount,
            bill_no,
            bill_date
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)
        RETURNING id
        """,
        (
            user_id,
            customer_id,
            vehicle_id,
            trip_id,
            total_amount,
            bill_no,
            bill_date
        )
    )

    bill_id = cursor.fetchone()[0]

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Bill created",
        "bill_id": bill_id,
        "bill_no": bill_no
    }