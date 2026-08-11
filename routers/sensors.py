from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Device, SensorData
from schemas import UploadSensorData


router = APIRouter(
    prefix="/API",
    tags=["Upload Sensor Data", "Sensor Data", "Sensor History"]
)


# -------------------------
# UPLOAD SENSOR DATA
# -------------------------

@router.post("/UploadSensorData")
def upload_sensor_data(
    data: UploadSensorData,
    db: Session = Depends(get_db)
):

    device = db.query(Device).filter(
        Device.id == data.device_id
    ).first()

    if not device:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    sensor_data = SensorData(
        device_id=data.device_id,
        temperature=data.temperature,
        pressure=data.pressure
    )

    db.add(sensor_data)
    db.commit()
    db.refresh(sensor_data)

    return {
        "message": "Sensor data uploaded successfully",
        "data_id": sensor_data.id,
        "device_id": sensor_data.device_id,
        "temperature": sensor_data.temperature,
        "pressure": sensor_data.pressure,
        "created_at": sensor_data.created_at
    }


# -------------------------
# LATEST SENSOR VALUE
# -------------------------

@router.get("/LatestValue/{device_id}")
def latest_value(
    device_id: int,
    db: Session = Depends(get_db)
):

    data = (
        db.query(SensorData)
        .filter(SensorData.device_id == device_id)
        .order_by(SensorData.created_at.desc())
        .first()
    )

    if not data:
        raise HTTPException(
            status_code=404,
            detail="No sensor data found"
        )

    return {
        "device_id": device_id,
        "temperature": data.temperature,
        "pressure": data.pressure,
        "created_at": data.created_at
    }


# -------------------------
# DASHBOARD
# -------------------------
@router.get("/Dashboard/{user_id}")
def dashboard(
    user_id: int,
    db: Session = Depends(get_db)
):

    devices = db.query(Device).filter(
        Device.user_id == user_id
    ).all()

    dashboard_data = []

    for device in devices:

        latest = (
            db.query(SensorData)
            .filter(SensorData.device_id == device.id)
            .order_by(SensorData.created_at.desc())
            .first()
        )

        dashboard_data.append({
            "device_id": device.id,
            "device_name": device.device_name,
            "device_type": device.device_type,
            "latest_data": {
                "temperature": latest.temperature if latest else None,
                "pressure": latest.pressure if latest else None,
                "created_at": latest.created_at if latest else None
            }
        })

    return {
        "user_id": user_id,
        "devices": dashboard_data
    }
@router.get("/History/{user_id}")
def get_history(
    user_id: int,
    db: Session = Depends(get_db)
):

    devices = db.query(Device).filter(
        Device.user_id == user_id
    ).all()

    history = []

    for device in devices:

        sensor_data = db.query(SensorData).filter(
            SensorData.device_id == device.id
        ).all()

        data = []

        for item in sensor_data:

            data.append({
                "id": item.id,
                "temperature": item.temperature,
                "pressure": item.pressure,
                "created_at": item.created_at
            })

        history.append({
            "device_id": device.id,
            "device_name": device.device_name,
            "device_type": device.device_type,
            "data": data
        })

    return {
        "user_id": user_id,
        "history": history
    }