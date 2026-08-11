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
@router.put("/API/UpdateDevice/{device_id}")
def update_device(
    device_id: int,
    device_name: str = None,
    device_type: str = None,
    db: Session = Depends(get_db)
):
    # Find device
    device = db.query(Device).filter(
        Device.id == device_id
    ).first()

    # Device not found
    if not device:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    # Update only provided values
    if device_name is not None:
        device.device_name = device_name

    if device_type is not None:
        device.device_type = device_type

    # Save changes
    db.commit()
    db.refresh(device)

    return {
        "message": "Device updated successfully",
        "device": {
            "id": device.id,
            "device_name": device.device_name,
            "device_type": device.device_type,
            "user_id": device.user_id
        }
    }


# ==============================
# DELETE DEVICE
# ==============================

@router.delete("/DeleteDevice/{device_id}")
def delete_device(
    device_id: int,
    db: Session = Depends(get_db)
):

    device = db.query(Device).filter(
        Device.id == device_id
    ).first()

    if not device:
        raise HTTPException(
            status_code=404,
            detail="Device not found"
        )

    db.delete(device)
    db.commit()

    return {
        "message": "Device deleted successfully",
        "device_id": device_id
    }
