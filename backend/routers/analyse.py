from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.services.entity_resolution import run_entity_resolution
from backend.services.risk_engine import run_risk_analysis


router = APIRouter(
    prefix="/analyse",
    tags=["Analysis"],
)


@router.post("")
def analyse_vendor_data(
    db: Session = Depends(get_db),
):
    """
    Run the complete Vendor Shield analysis pipeline.

    1. Detect vendor relationships
    2. Generate risk signals
    3. Calculate vendor risk scores
    """

    relationship_result = run_entity_resolution(db)

    risk_result = run_risk_analysis(db)

    return {
        "message": "Vendor analysis completed successfully",
        "relationships": relationship_result,
        "risk_analysis": risk_result,
    }