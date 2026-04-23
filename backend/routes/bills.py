from fastapi import APIRouter, Depends
from database import get_connection
from utils.dependencies import get_current_user
from schemas.bill_schema import CreateBillRequest
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer
)

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from fastapi.responses import FileResponse

from num2words import num2words

import os

from fastapi import BackgroundTasks

# ---------- FILE DELETE FUNCTION ----------

def delete_file(path: str):

    if os.path.exists(path):

        os.remove(path)

router = APIRouter(
    prefix="/api/bills",
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
    
@router.get("/")
def get_bills(
    user_id: int = Depends(get_current_user)
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            b.id,
            b.bill_no,
            b.bill_date,
            b.total_amount,
            c.name

        FROM bills b

        JOIN customers c
        ON b.customer_id = c.id

        WHERE b.user_id = %s

        ORDER BY b.bill_no DESC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    bills = []

    for row in rows:

        bills.append({

            "id": row[0],
            "bill_no": row[1],
            "bill_date": row[2],
            "total_amount": float(row[3]),
            "customer_name": row[4]

        })

    cursor.close()
    conn.close()

    return bills

@router.get("/{bill_id}")
def get_single_bill(
    bill_id: int,
    user_id: int = Depends(get_current_user)
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            b.id,
            b.bill_no,
            b.bill_date,
            b.total_amount,

            c.name,
            c.phone,

            v.vehicle_no,

            t.source,
            t.destination,
            t.total_km,
            t.rate_per_km,
            t.per_day_km,
            t.total_nights,
            t.toll_tax_parking,
            t.is_return

        FROM bills b

        JOIN customers c
        ON b.customer_id = c.id

        LEFT JOIN vehicles v
        ON b.vehicle_id = v.id

        JOIN trips t
        ON b.trip_id = t.id

        WHERE b.id = %s
        AND b.user_id = %s
        """,
        (
            bill_id,
            user_id
        )
    )

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:

        return {
            "error": "Bill not found"
        }

    return {

        "id": row[0],
        "bill_no": row[1],
        "bill_date": row[2],
        "total_amount": float(row[3]),

        "customer_name": row[4],
        "customer_phone": row[5],

        "vehicle_no": row[6],

        "source": row[7],
        "destination": row[8],
        "total_km": row[9],
        "rate_per_km": row[10],
        "per_day_km": row[11],
        "total_nights": row[12],
        "toll_tax_parking": row[13],
        "is_return": row[14]

    }
    
@router.delete("/{bill_id}")
def delete_bill(
    bill_id: int,
    user_id: int = Depends(get_current_user)
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        DELETE FROM bills
        WHERE id = %s
        AND user_id = %s
        """,
        (bill_id, user_id)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {
        "message": "Bill deleted"
    }

@router.get("/{bill_id}/pdf")
def download_bill_pdf(
    bill_id: int,
    background_tasks: BackgroundTasks,
    user_id: int = Depends(get_current_user)
):

    # ---------- FONT REGISTER ----------

    font_path = os.path.join(
        os.getcwd(),
        "fonts",
        "NotoSans-VariableFont_wdth,wght.ttf"
    )

    pdfmetrics.registerFont(
        TTFont(
            "NotoSans",
            font_path
        )
    )

    # ---------- FETCH DATA ----------

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT

            b.bill_no,
            b.bill_date,
            b.total_amount,

            c.name,
            c.phone,

            v.vehicle_no,

            t.source,
            t.destination,
            t.total_km,
            t.rate_per_km,
            t.per_day_km,
            t.total_nights,
            t.toll_tax_parking,
            t.is_return

        FROM bills b

        JOIN customers c
        ON b.customer_id = c.id

        LEFT JOIN vehicles v
        ON b.vehicle_id = v.id

        JOIN trips t
        ON b.trip_id = t.id

        WHERE b.id = %s
        AND b.user_id = %s
        """,
        (bill_id, user_id)
    )

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:

        return {"error": "Bill not found"}

    (
        bill_no,
        bill_date,
        total_amount,

        customer_name,
        customer_phone,

        vehicle_no,

        source,
        destination,
        total_km,
        rate_per_km,
        per_day_km,
        total_nights,
        toll_tax_parking,
        is_return

    ) = row

    # ---------- VISIT PLACE ----------

    visit_place = f"{source} to {destination}"

    if is_return:
        visit_place += " & Return"

    # ---------- AMOUNT WORDS ----------

    amount_words = num2words(
        int(total_amount),
        lang="en_IN"
    )

    amount_words = (
        amount_words.capitalize()
        + " only"
    )

    # ---------- PDF ----------

    file_path = f"bill_{bill_no}.pdf"

    styles = getSampleStyleSheet()

    styles["Normal"].fontName = "NotoSans"

    doc = SimpleDocTemplate(
        file_path,
        rightMargin=20,
        leftMargin=20,
        topMargin=20,
        bottomMargin=20
    )

    elements = []

    # ---------- HEADER ----------

    header_table = Table([

        [
            f"Bill No: {bill_no}",
            f"Vehicle: {vehicle_no or '-'}",
            f"Date: {bill_date}"
        ]

    ], colWidths=[150,150,150])

    header_table.setStyle(TableStyle([

        ("GRID", (0,0), (-1,-1), 1, colors.black),

        ("FONTNAME",
         (0,0), (-1,-1),
         "NotoSans")

    ]))

    elements.append(header_table)

    elements.append(Spacer(1, 10))

    # ---------- CUSTOMER ----------

    elements.append(

        Paragraph(
            f"<b>Name of Party:</b> {customer_name}",
            styles["Normal"]
        )

    )

    elements.append(Spacer(1, 12))

    # ---------- PARTICULARS ----------

    particulars_data = [

        ["PARTICULARS", "AMOUNT"],

        ["Rate Per KM",
         f"₹ {rate_per_km}"],

        ["Per Day KM",
         per_day_km],

        ["Total Night",
         f"₹ {total_nights}"],

        ["Total KM",
         f"{total_km} KM"],

        ["Toll, Tax & Parking",
         f"₹ {toll_tax_parking}"],

        ["Others", ""],

        ["Visit Place",
         visit_place],

        ["", ""],
        ["", ""],
        ["", ""],
        ["", ""],
        ["", ""]

    ]

    particulars_table = Table(

        particulars_data,

        colWidths=[260,140],

        rowHeights=[22] * len(particulars_data)

    )

    particulars_table.setStyle(TableStyle([

        ("GRID", (0,0), (-1,-1), 1, colors.black),

        ("BACKGROUND",
         (0,0), (-1,0),
         colors.lightgrey),

        ("FONTNAME",
         (0,0), (-1,-1),
         "NotoSans"),

        ("ALIGN",
         (1,1), (-1,-1),
         "RIGHT")

    ]))

    elements.append(particulars_table)

    elements.append(Spacer(1, 15))

    # ---------- TOTAL ----------

    total_table = Table([

        ["TOTAL",
         f"₹ {total_amount}"]

    ],

        colWidths=[260,140]

    )

    total_table.setStyle(TableStyle([

        ("GRID", (0,0), (-1,-1), 1, colors.black),

        ("BACKGROUND",
         (0,0), (-1,0),
         colors.lightgrey),

        ("FONTNAME",
         (0,0), (-1,-1),
         "NotoSans"),

        ("ALIGN",
         (1,0), (-1,0),
         "RIGHT")

    ]))

    elements.append(total_table)

    elements.append(Spacer(1, 10))

    # ---------- AMOUNT WORDS ----------

    elements.append(

        Paragraph(
            f"<b>Rs. in words:</b> {amount_words}",
            styles["Normal"]
        )

    )

    # ---------- BUILD ----------

    doc.build(elements)

    # ---------- DELETE AFTER SEND ----------

    background_tasks.add_task(
        delete_file,
        file_path
    )

    return FileResponse(

        file_path,

        media_type="application/pdf",

        filename=f"Bill_{bill_no}.pdf",

        background=background_tasks

    )