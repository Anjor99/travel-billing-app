from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import get_connection

app = FastAPI()

@app.get("/test-db")
def test_db():
    try:
        conn = get_connection()
        conn.close()
        return {"status": "Database Connected"}
    except Exception as e:
        return {
            "status": "Database Failed",
            "error": str(e)
        }
# Serve React frontend build
app.mount(
    "/",
    StaticFiles(directory="../frontend/dist", html=True),
    name="frontend"
)