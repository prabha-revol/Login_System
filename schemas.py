from pydantic import BaseModel
from typing import Optional


# -------------------------
# USER
# -------------------------

class RegisterUser(BaseModel):
    username: str
    email: str
    password: str
    role: str = "user"


class LoginUser(BaseModel):
    username: str
    password: str


# -------------------------
# DEVICE
# -------------------------

class AddDevice(BaseModel):
    device_name: str
    device_type: str
    user_id: int


# -------------------------
# SENSOR DATA
# -------------------------

class UploadSensorData(BaseModel):
    device_id: int
    temperature: Optional[float] = None
    pressure: Optional[float] = None