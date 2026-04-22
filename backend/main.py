from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import get_connection
from routes import auth

app = FastAPI()

app.include_router(auth.router)
# Serve React frontend build
app.mount(
    "/",
    StaticFiles(directory="../frontend/dist", html=True),
    name="frontend"
)