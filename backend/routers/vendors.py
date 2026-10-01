from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database import get_db
from backend.models import (
    Vendor,
    VendorChange,
    Transaction,
    RiskEvent,
)
from backend.services.risk_engine import (
    calculate_risk_score,
    get_risk_level,
)


router = APIRouter(
    prefix="/vendors",
    tags=["Vendors"],
)


@router.get("")
def get_vendors(
    db: Session = Depends(get_db),
):
    vendors = db.query(Vendor).all()

    risk_events = db.query(RiskEvent).all()

    events_by_vendor = {}

    for event in risk_events:
        events_by_vendor.setdefault(
            event.vendor_id,
            [],
        ).append(event)

    result = []

    for vendor in vendors:

        events = events_by_vendor.get(
            vendor.vendor_id,
            [],
        )

        risk_score = calculate_risk_score(
            events
        )

        risk_level = get_risk_level(
            risk_score
        )

        exposure = (
            db.query(
                func.sum(Transaction.amount)
            )
            .filter(
                Transaction.vendor_id
                == vendor.vendor_id,
                Transaction.status
                == "PENDING",
            )
            .scalar()
        )

        latest_change = (
            db.query(VendorChange)
            .filter(
                VendorChange.vendor_id
                == vendor.vendor_id
            )
            .order_by(
                VendorChange.changed_at.desc()
            )
            .first()
        )

        result.append(
            {
                "vendor_id":
                    vendor.vendor_id,

                "vendor_name":
                    vendor.legal_name,

                "gstin":
                    vendor.gstin,

                "pan":
                    vendor.pan,

                "bank_account":
                    vendor.bank_account_masked
                    or vendor.bank_account,

                "bank_ifsc":
                    vendor.bank_ifsc,

                "phone":
                    vendor.phone,

                "email":
                    vendor.email,

                "address":
                    vendor.address,

                "status":
                    vendor.status,

                "risk_score":
                    risk_score,

                "risk_level":
                    risk_level,

                "payment_exposure":
                    float(exposure)
                    if exposure
                    else 0,

                "last_change":
                    (
                        latest_change.changed_at
                        .strftime("%d %b %Y")
                        if latest_change
                        and latest_change.changed_at
                        else "No recent change"
                    ),
            }
        )

    result.sort(
        key=lambda item:
            item["risk_score"],
        reverse=True,
    )

    return result


@router.get("/{vendor_id}")
def get_vendor(
    vendor_id: str,
    db: Session = Depends(get_db),
):
    vendor = (
        db.query(Vendor)
        .filter(
            Vendor.vendor_id
            == vendor_id
        )
        .first()
    )

    if vendor is None:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found",
        )

    events = (
        db.query(RiskEvent)
        .filter(
            RiskEvent.vendor_id
            == vendor_id
        )
        .all()
    )

    risk_score = calculate_risk_score(
        events
    )

    return {
        "vendor_id":
            vendor.vendor_id,

        "vendor_name":
            vendor.legal_name,

        "gstin":
            vendor.gstin,

        "pan":
            vendor.pan,

        "bank_account":
            vendor.bank_account_masked
            or vendor.bank_account,

        "bank_ifsc":
            vendor.bank_ifsc,

        "phone":
            vendor.phone,

        "email":
            vendor.email,

        "address":
            vendor.address,

        "status":
            vendor.status,

        "risk_score":
            risk_score,

        "risk_level":
            get_risk_level(
                risk_score
            ),
    }