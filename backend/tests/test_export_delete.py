import pytest
from app.models.user import User
from app.models.period import PeriodCycle
from app.models.symptom import DailySymptom


def test_user_profile_update(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    update_payload = {
        "cycle_length_days": 30,
        "period_duration_days": 6,
        "privacy_mode": True,
        "preferred_language": "bn"
    }

    res = client.put("/api/users/profile", json=update_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["cycle_length_days"] == 30
    assert data["period_duration_days"] == 6
    assert data["privacy_mode"] is True
    assert data["preferred_language"] == "bn"


def test_data_export_endpoint(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    # Add cycle and symptom
    client.post("/api/cycles", json={
        "start_date": "2026-06-01",
        "end_date": "2026-06-05",
        "bleeding_intensity": "medium"
    }, headers=headers)

    client.post("/api/symptoms", json={
        "date": "2026-06-01",
        "cramps_severity": 4,
        "bleeding_flow": "medium"
    }, headers=headers)

    export_res = client.get("/api/users/export", headers=headers)
    assert export_res.status_code == 200
    export_data = export_res.json()
    assert "metadata" in export_data
    assert "user_profile" in export_data
    assert "period_cycles" in export_data
    assert "symptoms" in export_data
    assert len(export_data["period_cycles"]) >= 1
    assert len(export_data["symptoms"]) >= 1


def test_cascading_account_deletion(client, db_session):
    # Register disposable user
    reg_res = client.post("/api/auth/register", json={
        "name": "Disposable User",
        "email": "disposable@example.com",
        "password": "Password123!",
        "confirm_password": "Password123!",
        "consent": True
    })
    token = reg_res.json()["access_token"]
    user_id = reg_res.json()["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}

    # Add cycle and symptom
    client.post("/api/cycles", json={
        "start_date": "2026-04-01",
        "end_date": "2026-04-05",
        "bleeding_intensity": "light"
    }, headers=headers)

    client.post("/api/symptoms", json={
        "date": "2026-04-01",
        "cramps_severity": 3
    }, headers=headers)

    # Verify records exist in database
    assert db_session.query(PeriodCycle).filter(PeriodCycle.user_id == user_id).count() == 1
    assert db_session.query(DailySymptom).filter(DailySymptom.user_id == user_id).count() == 1

    # Delete account
    del_res = client.delete("/api/users/account", headers=headers)
    assert del_res.status_code == 200

    # Verify user is purged
    assert db_session.query(User).filter(User.id == user_id).first() is None
    # Verify cascading deletion purged all period cycles and symptoms
    assert db_session.query(PeriodCycle).filter(PeriodCycle.user_id == user_id).count() == 0
    assert db_session.query(DailySymptom).filter(DailySymptom.user_id == user_id).count() == 0
