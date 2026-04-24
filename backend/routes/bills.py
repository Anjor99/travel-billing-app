from fastapi import APIRouter, Depends
from database import get_connection
from utils.dependencies import get_current_user
from schemas.bill_schema import CreateBillRequest
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
    Image
)

from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from fastapi.responses import FileResponse

from num2words import num2words

import os
import requests
import io

from fastapi import BackgroundTasks
from reportlab.lib.styles import ParagraphStyle

wrap_style = ParagraphStyle(

    name="WrapStyle",

    fontName="NotoSans",

    fontSize=10,

    leading=12,

    wordWrap="LTR"

)

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

@router.put("/{bill_id}")
def update_bill(

    bill_id: int,
    payload: CreateBillRequest,
    user_id: int = Depends(get_current_user)

):

    conn = get_connection()
    cursor = conn.cursor()

    # ---------- FETCH EXISTING ----------

    cursor.execute(
        """
        SELECT
            customer_id,
            vehicle_id,
            trip_id
        FROM bills
        WHERE id = %s
        AND user_id = %s
        """,
        (bill_id, user_id)
    )

    row = cursor.fetchone()

    if not row:

        cursor.close()
        conn.close()

        return {"error": "Bill not found"}

    customer_id, vehicle_id, trip_id = row

    # ---------- UPDATE CUSTOMER ----------

    cursor.execute(
        """
        UPDATE customers
        SET
            name = %s,
            phone = %s
        WHERE id = %s
        """,
        (
            payload.customer_name,
            payload.customer_phone,
            customer_id
        )
    )

    # ---------- UPDATE VEHICLE ----------

    if vehicle_id:

        cursor.execute(
            """
            UPDATE vehicles
            SET vehicle_no = %s
            WHERE id = %s
            """,
            (
                payload.vehicle_no,
                vehicle_id
            )
        )

    # ---------- UPDATE TRIP ----------

    cursor.execute(
        """
        UPDATE trips
        SET

            source = %s,
            destination = %s,

            total_km = %s,
            rate_per_km = %s,

            per_day_km = %s,
            total_nights = %s,
            toll_tax_parking = %s,

            is_return = %s

        WHERE id = %s
        """,
        (

            payload.source,
            payload.destination,

            payload.total_km,
            payload.rate_per_km,

            payload.per_day_km,
            payload.total_nights,
            payload.toll_tax_parking,

            payload.is_return,

            trip_id

        )
    )

    # ---------- RECALCULATE TOTAL ----------

    trip_amount = (

        payload.total_km
        * payload.rate_per_km

    )

    total_amount = (

        trip_amount
        + payload.toll_tax_parking
        + payload.total_nights

    )

    # ---------- UPDATE BILL ----------

    cursor.execute(
        """
        UPDATE bills
        SET

            total_amount = %s,
            bill_date = %s

        WHERE id = %s
        """,
        (

            total_amount,
            payload.bill_date,

            bill_id

        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return {

        "message": "Bill updated",
        "bill_id": bill_id

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

    font_dir = os.path.join(
        os.getcwd(),
        "fonts"
    )

    normal_font = os.path.join(
        font_dir,
        "NotoSans-VariableFont_wdth,wght.ttf"
    )

    bold_font = os.path.join(
        font_dir,
        "NotoSans-Bold.ttf"
    )

    pdfmetrics.registerFont(
        TTFont("NotoSans", normal_font)
    )

    pdfmetrics.registerFont(
        TTFont("NotoSans-Bold", bold_font)
    )

    # ---------- STYLE ----------

    wrap_style = ParagraphStyle(

        name="WrapStyle",

        fontName="NotoSans",

        fontSize=10,

        leading=12

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
            t.is_return,

            u.header_url,
            u.footer_url

        FROM bills b

        JOIN customers c
        ON b.customer_id = c.id

        LEFT JOIN vehicles v
        ON b.vehicle_id = v.id

        JOIN trips t
        ON b.trip_id = t.id

        JOIN users u
        ON b.user_id = u.id

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
        is_return,

        header_url,
        footer_url

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

    doc = SimpleDocTemplate(

        file_path,

        rightMargin=20,
        leftMargin=20,
        topMargin=20,
        bottomMargin=20

    )

    elements = []

    usable_width = doc.width

    # =====================================================
    # HEADER IMAGE
    # =====================================================

    if header_url:

        try:

            response = requests.get(header_url)

            header_img = Image(
                io.BytesIO(response.content)
            )

            # Auto scale to page width

            header_img.drawWidth = usable_width

            header_img.drawHeight = (

                header_img.imageHeight
                * usable_width
                / header_img.imageWidth

            )

            elements.append(header_img)

            elements.append(
                Spacer(1, 10)
            )

        except Exception:
            pass

    # =====================================================
    # HEADER TABLE
    # =====================================================

    header_table = Table([

        [

            Paragraph(
                f"Bill No: {bill_no}",
                wrap_style
            ),

            Paragraph(
                f"Vehicle: {vehicle_no or '-'}",
                wrap_style
            ),

            Paragraph(
                f"Date: {bill_date}",
                wrap_style
            )

        ]

    ],

        colWidths=[

            usable_width / 3,
            usable_width / 3,
            usable_width / 3

        ]

    )

    header_table.setStyle(TableStyle([

        ("GRID", (0,0), (-1,-1), 1, colors.black)

    ]))

    elements.append(header_table)

    elements.append(
        Spacer(1, 10)
    )

    # =====================================================
    # NAME OF PARTY
    # =====================================================

    elements.append(

        Paragraph(

            f'<font name="NotoSans-Bold">'
            f'Name of Party:</font> '
            f'{customer_name}',

            wrap_style

        )

    )

    elements.append(
        Spacer(1, 12)
    )

    # =====================================================
    # PARTICULARS TABLE
    # =====================================================

    particulars_data = [

        [
            Paragraph("<b>PARTICULARS</b>", wrap_style),
            Paragraph("<b>AMOUNT</b>", wrap_style)
        ],

        [
            Paragraph("Rate Per KM", wrap_style),
            Paragraph(f"\u20B9 {rate_per_km}", wrap_style)
        ],

        [
            Paragraph("Per Day KM", wrap_style),
            Paragraph(str(per_day_km), wrap_style)
        ],

        [
            Paragraph("Total Night", wrap_style),
            Paragraph(f"\u20B9 {total_nights}", wrap_style)
        ],

        [
            Paragraph("Total KM", wrap_style),
            Paragraph(f"{total_km} KM", wrap_style)
        ],

        [
            Paragraph(
                "Toll, Tax & Parking",
                wrap_style
            ),
            Paragraph(
                f"\u20B9 {toll_tax_parking}",
                wrap_style
            )
        ],

        [
            Paragraph("Others", wrap_style),
            Paragraph("", wrap_style)
        ],

        [
            Paragraph("Visit Place", wrap_style),
            Paragraph(visit_place, wrap_style)
        ],

        ["",""],
        ["",""],
        ["",""],
        ["",""],
        ["",""]

    ]

    particulars_table = Table(

        particulars_data,

        colWidths=[

            usable_width * 0.65,
            usable_width * 0.35

        ]

    )

    particulars_table.setStyle(TableStyle([

        ("GRID", (0,0), (-1,-1), 1, colors.black),

        ("BACKGROUND",
         (0,0), (-1,0),
         colors.lightgrey),

        ("ALIGN",
         (1,1), (-1,-1),
         "RIGHT")

    ]))

    elements.append(particulars_table)

    elements.append(
        Spacer(1, 15)
    )

    # =====================================================
    # TOTAL TABLE
    # =====================================================

    total_table = Table([

        [

            Paragraph(
                "<b>TOTAL</b>",
                wrap_style
            ),

            Paragraph(
                f"\u20B9 {total_amount}",
                wrap_style
            )

        ]

    ],

        colWidths=[

            usable_width * 0.65,
            usable_width * 0.35

        ]

    )

    total_table.setStyle(TableStyle([

        ("GRID", (0,0), (-1,-1), 1, colors.black),

        ("BACKGROUND",
         (0,0), (-1,0),
         colors.lightgrey),

        ("ALIGN",
         (1,0), (-1,0),
         "RIGHT")

    ]))

    elements.append(total_table)

    elements.append(
        Spacer(1, 10)
    )

    # =====================================================
    # RS IN WORDS
    # =====================================================

    elements.append(

        Paragraph(

            f'<font name="NotoSans-Bold">'
            f'Rs. in words:</font> '
            f'{amount_words}',

            wrap_style

        )

    )

    # =====================================================
    # FOOTER IMAGE
    # =====================================================

    if footer_url:

        try:

            response = requests.get(footer_url)

            footer_img = Image(
                io.BytesIO(response.content)
            )

            footer_img.drawWidth = usable_width

            footer_img.drawHeight = (

                footer_img.imageHeight
                * usable_width
                / footer_img.imageWidth

            )

            elements.append(
                Spacer(1, 30)
            )

            elements.append(footer_img)

        except Exception:
            pass

    # ---------- BUILD ----------

    doc.build(elements)

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