from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from database import Base, engine

from routers import users
from routers import devices
from routers import sensors


# =====================================================
# CREATE DATABASE TABLES
# =====================================================

Base.metadata.create_all(bind=engine)


# =====================================================
# CREATE FASTAPI APP
# =====================================================

app = FastAPI(
    title="IoT Login System API",
    version="0.1.0"
)


# =====================================================
# STATIC FILES
# =====================================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# =====================================================
# TEMPLATES
# =====================================================

templates = Jinja2Templates(
    directory="templates"
)


# =====================================================
# REGISTER API ROUTERS
# =====================================================

app.include_router(users.router)
app.include_router(devices.router)
app.include_router(sensors.router)


# =====================================================
# HOME PAGE
# =====================================================

@app.get("/")
def home(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={}
    )


# =====================================================
# REGISTER PAGE
# =====================================================

@app.get("/Register")
def register_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="register.html",
        context={}
    )


# =====================================================
# LOGIN PAGE
# =====================================================

@app.get("/Login")
def login_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="login.html",
        context={}
    )


# =====================================================
# DASHBOARD PAGE
# =====================================================

@app.get("/dashboard")
def dashboard_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="dashboard.html",
        context={}
    )


# =====================================================
# HISTORY PAGE
# =====================================================

@app.get("/history")
def history_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="history.html",
        context={}
    )
# -------------------------
# GRAPH PAGE
# -------------------------

@app.get("/graph")
def graph_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="graph.html",
        context={}
    )
