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
    allow_origins=config.settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# HEALTH CHECK ROUTES
# -------------------------

@app.get("/healthz")
def health_check():
    return {"status": "healthy"}

# -------------------------
# API ROUTES
# -------------------------

app.include_router(auth.router)
app.include_router(bills.router)
app.include_router(settings.router)