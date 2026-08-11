from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from database import Base, engine

from routers import users
from routers import devices
from routers import sensors


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI app
app = FastAPI(
    title="IoT Login System API",
    version="0.1.0"
)


# Static files
app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# Templates
templates = Jinja2Templates(
    directory="templates"
)


# Register routers
app.include_router(users.router)
app.include_router(devices.router)
app.include_router(sensors.router)


# -------------------------
# HOME PAGE
# -------------------------

@app.get("/")
def root():
    return {
        "message": "IoT Login System API is running"
    }


# -------------------------
# LOGIN PAGE
# -------------------------

@app.get("/Login")
def login_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={}
    )


# -------------------------
# DASHBOARD PAGE
# -------------------------

@app.get("/dashboard")
def dashboard_page(
    request: Request
):

    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={}
    )


# -------------------------
# HISTORY PAGE
# -------------------------

@app.get("/history")
def history_page(
    request: Request
):

    return templates.TemplateResponse(
        request=request,
        name="history.html",
        context={}
    )