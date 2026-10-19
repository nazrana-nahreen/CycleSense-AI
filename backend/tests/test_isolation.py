import pytest


def test_period_cycle_user_isolation_and_idor_protection(client, user_a_token, user_b_token):
    headers_a = {"Authorization": f"Bearer {user_a_token}"}
    headers_b = {"Authorization": f"Bearer {user_b_token}"}

    # User A creates a period cycle
    res_a = client.post("/api/cycles", json={
        "start_date": "2026-09-01",
        "end_date": "2026-09-05",
        "bleeding_intensity": "medium",
        "notes": "User A private health note"
    }, headers=headers_a)
    assert res_a.status_code == 201
    user_a_cycle_id = res_a.json()["id"]

    # 1. User B lists cycles: User A's cycle must NOT be visible
    list_b = client.get("/api/cycles", headers=headers_b)
    assert list_b.status_code == 200
    assert all(c["id"] != user_a_cycle_id for c in list_b.json())

    # 2. User B attempts to edit User A's cycle (IDOR exploit attempt)
    malicious_update = client.put(f"/api/cycles/{user_a_cycle_id}", json={
        "bleeding_intensity": "heavy",
        "notes": "Tampered by User B"
    }, headers=headers_b)
    assert malicious_update.status_code == 404

    # Verify User A's record remained untampered
    verify_a = client.get("/api/cycles", headers=headers_a)
    target = next(c for c in verify_a.json() if c["id"] == user_a_cycle_id)
    assert target["notes"] == "User A private health note"

    # 3. User B attempts to delete User A's cycle (IDOR exploit attempt)
    malicious_delete = client.delete(f"/api/cycles/{user_a_cycle_id}", headers=headers_b)
    assert malicious_delete.status_code == 404

    # Verify User A's record is still present
    verify_still_exists = client.get("/api/cycles", headers=headers_a)
    assert any(c["id"] == user_a_cycle_id for c in verify_still_exists.json())


def test_symptom_user_isolation_and_idor_protection(client, user_a_token, user_b_token):
    headers_a = {"Authorization": f"Bearer {user_a_token}"}
    headers_b = {"Authorization": f"Bearer {user_b_token}"}

    # User A creates a symptom log
    res_a = client.post("/api/symptoms", json={
        "date": "2026-09-02",
        "cramps_severity": 8,
        "bleeding_flow": "heavy",
        "notes": "User A private symptom log"
    }, headers=headers_a)
    assert res_a.status_code == 201
    user_a_symptom_id = res_a.json()["id"]

    # 1. User B lists symptoms: User A's entry must NOT appear
    list_b = client.get("/api/symptoms", headers=headers_b)
    assert list_b.status_code == 200
    assert all(s["id"] != user_a_symptom_id for s in list_b.json())

    # 2. User B tries to update User A's symptom
    malicious_update = client.put(f"/api/symptoms/{user_a_symptom_id}", json={
        "cramps_severity": 1
    }, headers=headers_b)
    assert malicious_update.status_code == 404

    # 3. User B tries to delete User A's symptom
    malicious_delete = client.delete(f"/api/symptoms/{user_a_symptom_id}", headers=headers_b)
    assert malicious_delete.status_code == 404
