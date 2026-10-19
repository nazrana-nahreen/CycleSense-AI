import pytest
from app.models.user import User


def test_user_registration_success(client):
    payload = {
        "name": "Nusrat Jahan",
        "email": "nusrat@example.com",
        "password": "SecurePassword123!",
        "confirm_password": "SecurePassword123!",
        "preferred_language": "bn",
        "consent": True,
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "nusrat@example.com"
    assert data["user"]["name"] == "Nusrat Jahan"
    assert data["user"]["preferred_language"] == "bn"


def test_registration_validation_errors(client):
    # Missing consent
    res1 = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test1@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "consent": False
    })
    assert res1.status_code == 422

    # Password too short (< 8 chars)
    res2 = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test2@example.com",
        "password": "short",
        "confirm_password": "short",
        "consent": True
    })
    assert res2.status_code == 422

    # Mismatched passwords
    res3 = client.post("/api/auth/register", json={
        "name": "Test User",
        "email": "test3@example.com",
        "password": "Password123!",
        "confirm_password": "DifferentPassword123!",
        "consent": True
    })
    assert res3.status_code == 422


def test_duplicate_email_rejected(client):
    payload = {
        "name": "Duplicate Tester",
        "email": "duplicate@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "consent": True,
    }
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_login_flow(client):
    # Register user
    client.post("/api/auth/register", json={
        "name": "Login Tester",
        "email": "login@example.com",
        "password": "ValidPassword123!",
        "confirm_password": "ValidPassword123!",
        "consent": True,
    })

    # Successful login
    success_res = client.post("/api/auth/login", json={
        "email": "login@example.com",
        "password": "ValidPassword123!"
    })
    assert success_res.status_code == 200
    assert "access_token" in success_res.json()

    # Invalid password
    fail_res = client.post("/api/auth/login", json={
        "email": "login@example.com",
        "password": "WrongPassword!"
    })
    assert fail_res.status_code == 401


def test_password_never_stored_as_plaintext(client, db_session):
    client.post("/api/auth/register", json={
        "name": "Security Check",
        "email": "security@example.com",
        "password": "RawPlaintextPassword99!",
        "confirm_password": "RawPlaintextPassword99!",
        "consent": True,
    })
    user = db_session.query(User).filter(User.email == "security@example.com").first()
    assert user is not None
    assert user.hashed_password != "RawPlaintextPassword99!"
    assert user.hashed_password.startswith("$2")  # bcrypt hash signature


def test_auth_me_endpoint(client, user_a_token):
    # With valid Bearer token
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {user_a_token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "sarah@example.com"

    # Without token
    no_token_res = client.get("/api/auth/me")
    assert no_token_res.status_code == 401
