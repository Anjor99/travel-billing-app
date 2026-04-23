from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, bills

import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# API ROUTES FIRST
# -------------------------

app.include_router(auth.router)
app.include_router(bills.router)

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
# REACT CATCH-ALL (LAST)
# -------------------------

@app.get("/{full_path:path}")
async def serve_react(full_path: str):

    index_path = os.path.join(
        frontend_path,
        "index.html"
    )

    return FileResponse(index_path)