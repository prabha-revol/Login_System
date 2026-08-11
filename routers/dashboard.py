from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud

from database import get_db
from auth import get_current_user


router = APIRouter(
    prefix="/API",
    tags=["Dashboard"]
)


@router.get("/Dashboard/{user_id}")
def dashboard(
    user_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.id != user_id:

        raise HTTPException(
            status_code=403,
            detail="You are not allowed to access this dashboard"
        )

    return crud.get_dashboard_data(
        db,
        user_id
    )