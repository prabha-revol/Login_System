from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
from database import get_db

router = APIRouter(
    prefix="/API",
    tags=["Dashboard Summary"]
)

@router.get("/DashboardSummary")
def dashboard_summary(db: Session = Depends(get_db)):
    return crud.get_dashboard_summary(db)