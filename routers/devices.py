from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User, Device
from schemas import AddDevice


router = APIRouter(
    prefix="/API",
    tags=["Devices"]
)


# -------------------------
# ADD DEVICE
# -------------------------

@router.post("/AddDevice")
def add_device(
    device: AddDevice,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.id == device.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    new_device = Device(
        device_name=device.device_name,
        device_type=device.device_type,
        user_id=device.user_id
    )

    db.add(new_device)
    db.commit()
    db.refresh(new_device)

    return {
        "message": "Device added successfully",
        "device_id": new_device.id,
        "device_name": new_device.device_name,
        "device_type": new_device.device_type,
        "user_id": new_device.user_id
    }


# -------------------------
# GET USER DEVICES
# -------------------------

@router.get("/UserDevices/{user_id}")
def get_user_devices(
    user_id: int,
    db: Session = Depends(get_db)
):

    devices = db.query(Device).filter(
        Device.user_id == user_id
    ).all()

    return {
        "user_id": user_id,
        "devices": [
            {
                "device_id": device.id,
                "device_name": device.device_name,
                "device_type": device.device_type
            }
            for device in devices
        ]
    }