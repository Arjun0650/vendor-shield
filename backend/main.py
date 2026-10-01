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


app = FastAPI(
    title="VendorTrust API",
    description="Backend API for Vendor Shield VendorTrust application",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# INCLUDE ROUTERS
# ============================================================

# Upload
# Final endpoint:
# POST /api/upload
app.include_router(
    upload.router,
    prefix="/api"
)


# Dashboard
# Final endpoint:
# GET /api/dashboard
app.include_router(
    dashboard.router,
    prefix="/api"
)


# Analysis
# Final endpoint:
# POST /api/analyse
app.include_router(
    analyse.router,
    prefix="/api"
)


# Vendor Directory
# Final endpoints:
# GET /api/vendors
# GET /api/vendors/{vendor_id}
app.include_router(
    vendors.router,
    prefix="/api"
)


# Risk router already contains:
# prefix="/api/vendors"
#
# Final endpoints:
# GET /api/vendors/{vendor_id}/risk
# GET /api/vendors/{vendor_id}/dna
app.include_router(
    risk.router
)


# Graph router already contains:
# prefix="/api/vendors"
#
# Final endpoint:
# GET /api/vendors/{vendor_id}/relationships
app.include_router(
    graph.router
)