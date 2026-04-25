import config

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, bills, settings

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# API ROUTES
# -------------------------

app.include_router(auth.router)
app.include_router(bills.router)
app.include_router(settings.router)

# -------------------------
# STATIC FILES
# -------------------------

frontend_path = "../frontend/dist"

app.mount(
    "/assets",
    StaticFiles(
        directory=os.path.join(frontend_path, "assets")
    ),
    name="assets"
)

# -------------------------
# REACT APP
# -------------------------

@app.get("/favicon.png")
def favicon_png():

    favicon_path = os.path.join(
        frontend_path,
        "favicon.png"
    )

    return FileResponse(favicon_path)

@app.get("/{full_path:path}")
def serve_react(full_path: str):

    return FileResponse(
        os.path.join(frontend_path, "index.html")
    )