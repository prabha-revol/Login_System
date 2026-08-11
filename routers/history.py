from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import crud
from database import get_db

router = APIRouter(
    prefix="/API",
    tags=["Sensor History"]
)


@router.get("/History/{device_id}")
def sensor_history(
    device_id: int,
    db: Session = Depends(get_db)
):

    return crud.get_sensor_history(db, device_id)