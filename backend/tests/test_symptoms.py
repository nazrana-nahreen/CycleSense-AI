import pytest


def test_create_and_upsert_symptom(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    payload = {
        "date": "2026-10-15",
        "cramps_severity": 6,
        "bleeding_flow": "medium",
        "mood": "irritable",
        "acne": True,
        "bloating": True,
        "fatigue": True,
        "headache": False,
        "sleep_quality": "average",
        "notes": "Pelvic ache after lunch"
    }

    create_res = client.post("/api/symptoms", json=payload, headers=headers)
    assert create_res.status_code == 201
    data = create_res.json()
    assert data["cramps_severity"] == 6
    assert data["mood"] == "irritable"
    assert data["acne"] is True
    symptom_id = data["id"]

    # Upsert on same date with updated cramps score
    update_payload = {
        "date": "2026-10-15",
        "cramps_severity": 3,
        "bleeding_flow": "light",
        "mood": "calm",
        "acne": False,
        "bloating": False,
        "fatigue": False,
        "headache": False,
        "sleep_quality": "good",
        "notes": "Pain improved with tea"
    }

    upsert_res = client.post("/api/symptoms", json=update_payload, headers=headers)
    assert upsert_res.status_code == 201
    upsert_data = upsert_res.json()
    assert upsert_data["id"] == symptom_id  # Same record was updated
    assert upsert_data["cramps_severity"] == 3
    assert upsert_data["mood"] == "calm"


def test_symptom_pain_score_validation(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    # Score > 10 should be rejected
    invalid_high = {
        "date": "2026-10-16",
        "cramps_severity": 15,
        "bleeding_flow": "none"
    }
    res_high = client.post("/api/symptoms", json=invalid_high, headers=headers)
    assert res_high.status_code == 422

    # Score < 0 should be rejected
    invalid_low = {
        "date": "2026-10-16",
        "cramps_severity": -2,
        "bleeding_flow": "none"
    }
    res_low = client.post("/api/symptoms", json=invalid_low, headers=headers)
    assert res_low.status_code == 422


def test_delete_symptom(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    create_res = client.post("/api/symptoms", json={
        "date": "2026-10-17",
        "cramps_severity": 2,
        "bleeding_flow": "none"
    }, headers=headers)
    symptom_id = create_res.json()["id"]

    del_res = client.delete(f"/api/symptoms/{symptom_id}", headers=headers)
    assert del_res.status_code == 200

    # Ensure deleted
    list_res = client.get("/api/symptoms?date=2026-10-17", headers=headers)
    assert len(list_res.json()) == 0
