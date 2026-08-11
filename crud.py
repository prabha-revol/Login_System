import auth
import models
import schemas

from sqlalchemy.orm import Session


# =========================
# USER
# =========================

def create_user(
    db: Session,
    user: schemas.UserCreate
):

    hashed_password = auth.hash_password(
        user.password
    )

    db_user = models.User(
        username=user.username,
        password=hashed_password,
        role=user.role
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def login_user(
    db: Session,
    username: str,
    password: str
):

    db_user = db.query(models.User).filter(
        models.User.username == username
    ).first()

    if db_user is None:
        return None

    if not auth.verify_password(
        password,
        db_user.password
    ):
        return None

    return db_user


# =========================
# DEVICE
# =========================

def create_device(
    db: Session,
    device: schemas.DeviceCreate
):

    db_device = models.Device(
        device_name=device.device_name,
        device_type=device.device_type,
        location=device.location
    )

    db.add(db_device)
    db.commit()
    db.refresh(db_device)

    return db_device


def get_devices(db: Session):

    return db.query(
        models.Device
    ).all()


def get_device(
    db: Session,
    device_id: int
):

    return db.query(
        models.Device
    ).filter(
        models.Device.id == device_id
    ).first()


# =========================
# SENSOR DATA
# =========================

def create_sensor_data(
    db: Session,
    sensor: schemas.SensorUpload
):

    db_sensor = models.SensorData(
        device_id=sensor.device_id,
        sensor_name=sensor.sensor_name,
        sensor_value=sensor.sensor_value,
        unit=sensor.unit
    )

    db.add(db_sensor)
    db.commit()
    db.refresh(db_sensor)

    return db_sensor


def get_sensor_data(db: Session):

    return db.query(
        models.SensorData
    ).all()


# =========================
# DASHBOARD
# =========================

def get_dashboard_data(
    db: Session,
    user_id: int
):

    user = db.query(
        models.User
    ).filter(
        models.User.id == user_id
    ).first()

    devices = db.query(
        models.Device
    ).all()

    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        },
        "devices": [
            {
                "id": device.id,
                "device_name": device.device_name,
                "device_type": device.device_type,
                "location": device.location
            }
            for device in devices
        ]
    }