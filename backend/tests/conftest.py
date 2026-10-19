import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Set test environment
os.environ["ENVIRONMENT"] = "testing"
os.environ["DATABASE_URL"] = "sqlite:///./test_cyclesense.db"

from app.database import Base, get_db
from app.main import app
from app.services.seed_data import seed_articles
from app.models.user import User

TEST_DATABASE_URL = "sqlite:///./test_cyclesense.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    seed_articles(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_cyclesense.db"):
        try:
            os.remove("./test_cyclesense.db")
        except Exception:
            pass


@pytest.fixture
def db_session():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def user_a_token(client):
    register_payload = {
        "name": "Sarah Ahmed",
        "email": "sarah@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "preferred_language": "en",
        "consent": True
    }
    res = client.post("/api/auth/register", json=register_payload)
    if res.status_code == 201:
        return res.json()["access_token"]
    
    login_res = client.post("/api/auth/login", json={"email": "sarah@example.com", "password": "Password123!"})
    return login_res.json()["access_token"]


@pytest.fixture
def user_b_token(client):
    register_payload = {
        "name": "Fatima Khan",
        "email": "fatima@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "preferred_language": "bn",
        "consent": True
    }
    res = client.post("/api/auth/register", json=register_payload)
    if res.status_code == 201:
        return res.json()["access_token"]
    
    login_res = client.post("/api/auth/login", json={"email": "fatima@example.com", "password": "Password123!"})
    return login_res.json()["access_token"]
