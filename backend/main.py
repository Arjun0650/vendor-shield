from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import (
    upload,
    risk,
    graph,
    dashboard,
    analyse,
    vendors,
)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="VendorTrust API",
    description="Backend API for Vendor Shield VendorTrust application",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

origins = [
    # Local frontend
    "http://localhost:5173",
    "http://127.0.0.1:5173",

    # Production Vercel frontend
    "https://vendor-shield-fawn.vercel.app",
]


app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,

    # Also allow Vercel-generated preview URLs
    allow_origin_regex=r"https://.*\.vercel\.app",

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# BASIC HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Vendor Shield API is running",
        "status": "healthy",
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
    }


# ============================================================
# API ROUTERS
# ============================================================


# ------------------------------------------------------------
# Upload
#
# POST /api/upload
# ------------------------------------------------------------

app.include_router(
    upload.router,
    prefix="/api",
)


# ------------------------------------------------------------
# Dashboard
#
# GET /api/dashboard
# ------------------------------------------------------------

app.include_router(
    dashboard.router,
    prefix="/api",
)


# ------------------------------------------------------------
# Analysis
#
# POST /api/analyse
# ------------------------------------------------------------

app.include_router(
    analyse.router,
    prefix="/api",
)


# ------------------------------------------------------------
# Vendor Directory
#
# GET /api/vendors
# GET /api/vendors/{vendor_id}
# ------------------------------------------------------------

app.include_router(
    vendors.router,
    prefix="/api",
)


# ------------------------------------------------------------
# Risk
#
# Router already contains prefix="/api/vendors"
#
# GET /api/vendors/{vendor_id}/risk
# GET /api/vendors/{vendor_id}/dna
# ------------------------------------------------------------

app.include_router(
    risk.router,
)


# ------------------------------------------------------------
# Relationship Graph
#
# Router already contains prefix="/api/vendors"
#
# GET /api/vendors/{vendor_id}/relationships
# ------------------------------------------------------------

app.include_router(
    graph.router,
)