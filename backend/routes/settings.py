from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import cloudinary.uploader
import cloudinary.api

from database import get_connection
from utils.dependencies import get_current_user

router = APIRouter(
    prefix="/api/settings",
    tags=["Settings"]
)


# =====================================================
# GET SETTINGS (fetch existing images)
# =====================================================

@router.get("/get-settings")
def get_settings(

    user_id: int = Depends(get_current_user)

):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT
            header_url,
            footer_url
        FROM users
        WHERE id=%s
        """,
        (user_id,)
    )

    row = cursor.fetchone()

    cursor.close()
    conn.close()

    return {

        "header_url": row[0],
        "footer_url": row[1]

    }


# =====================================================
# UPLOAD HEADER (also acts as EDIT)
# =====================================================

@router.post("/upload-header")
async def upload_header(

    file: UploadFile = File(...),

    user_id: int = Depends(get_current_user)

):

    try:

        result = cloudinary.uploader.upload(

            file.file,

            folder="travel_bills/headers",

            public_id=f"header_user_{user_id}",

            overwrite=True

        )

        image_url = result["secure_url"]

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE users
            SET header_url=%s
            WHERE id=%s
            """,
            (image_url, user_id)
        )

        conn.commit()

        cursor.close()
        conn.close()

        return {

            "message": "Header uploaded",
            "header_url": image_url

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )


# =====================================================
# DELETE HEADER
# =====================================================

@router.delete("/delete-header")
def delete_header(

    user_id: int = Depends(get_current_user)

):

    try:

        cloudinary.uploader.destroy(

            f"travel_bills/headers/header_user_{user_id}"

        )

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE users
            SET header_url=NULL
            WHERE id=%s
            """,
            (user_id,)
        )

        conn.commit()

        cursor.close()
        conn.close()

        return {

            "message": "Header deleted"

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )


# =====================================================
# UPLOAD FOOTER (also EDIT)
# =====================================================

@router.post("/upload-footer")
async def upload_footer(

    file: UploadFile = File(...),

    user_id: int = Depends(get_current_user)

):

    try:

        result = cloudinary.uploader.upload(

            file.file,

            folder="travel_bills/footers",

            public_id=f"footer_user_{user_id}",

            overwrite=True

        )

        image_url = result["secure_url"]

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE users
            SET footer_url=%s
            WHERE id=%s
            """,
            (image_url, user_id)
        )

        conn.commit()

        cursor.close()
        conn.close()

        return {

            "message": "Footer uploaded",
            "footer_url": image_url

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )


# =====================================================
# DELETE FOOTER
# =====================================================

@router.delete("/delete-footer")
def delete_footer(

    user_id: int = Depends(get_current_user)

):

    try:

        cloudinary.uploader.destroy(

            f"travel_bills/footers/footer_user_{user_id}"

        )

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE users
            SET footer_url=NULL
            WHERE id=%s
            """,
            (user_id,)
        )

        conn.commit()

        cursor.close()
        conn.close()

        return {

            "message": "Footer deleted"

        }

    except Exception as e:

        raise HTTPException(

            status_code=500,

            detail=str(e)

        )