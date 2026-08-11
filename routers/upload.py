from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
import schemas
from database import SessionLocal

router = APIRouter(tags=["Upload Sensor Data"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/API/UploadSensorData")
def upload_sensor_data(
    sensor: schemas.SensorUpload,
    db: Session = Depends(get_db)
):

    new_data = models.SensorData(
        device_id=sensor.device_id,
        sensor_value=sensor.value
    )

    db.add(new_data)
    db.commit()

    return {
        "status": "success",
        "message": "Sensor data uploaded successfully"
    }