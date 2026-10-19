import pytest


def test_create_and_list_period_cycle(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    cycle_payload = {
        "start_date": "2026-08-10",
        "end_date": "2026-08-14",
        "bleeding_intensity": "medium",
        "notes": "Mild cramps on day 1"
    }

    create_res = client.post("/api/cycles", json=cycle_payload, headers=headers)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["start_date"] == "2026-08-10"
    assert created_data["end_date"] == "2026-08-14"
    assert created_data["period_length"] == 5
    assert created_data["bleeding_intensity"] == "medium"
    assert created_data["notes"] == "Mild cramps on day 1"

    # List cycles
    list_res = client.get("/api/cycles", headers=headers)
    assert list_res.status_code == 200
    cycles = list_res.json()
    assert len(cycles) >= 1
    assert any(c["start_date"] == "2026-08-10" for c in cycles)


def test_date_order_validation(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}
    invalid_payload = {
        "start_date": "2026-09-15",
        "end_date": "2026-09-10",  # End before start
        "bleeding_intensity": "heavy"
    }
    res = client.post("/api/cycles", json=invalid_payload, headers=headers)
    assert res.status_code == 422


def test_update_and_delete_period_cycle(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}
    
    # Create cycle
    create_res = client.post("/api/cycles", json={
        "start_date": "2026-07-01",
        "end_date": "2026-07-05",
        "bleeding_intensity": "light"
    }, headers=headers)
    cycle_id = create_res.json()["id"]

    # Update cycle
    update_res = client.put(f"/api/cycles/{cycle_id}", json={
        "bleeding_intensity": "heavy",
        "notes": "Updated note: heavy bleeding noted"
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["bleeding_intensity"] == "heavy"
    assert update_res.json()["notes"] == "Updated note: heavy bleeding noted"

    # Delete cycle
    del_res = client.delete(f"/api/cycles/{cycle_id}", headers=headers)
    assert del_res.status_code == 200

    # Ensure deleted
    verify_list = client.get("/api/cycles", headers=headers)
    assert all(c["id"] != cycle_id for c in verify_list.json())


def test_cycle_stats_and_prediction(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    # Add 2 consecutive cycles to test length calculation
    client.post("/api/cycles", json={
        "start_date": "2026-05-01",
        "end_date": "2026-05-05",
        "bleeding_intensity": "medium"
    }, headers=headers)

    client.post("/api/cycles", json={
        "start_date": "2026-05-29",  # 28 days apart
        "end_date": "2026-06-02",
        "bleeding_intensity": "medium"
    }, headers=headers)

    # Check stats
    stats_res = client.get("/api/cycles/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_cycles_recorded"] >= 2
    assert stats["average_cycle_length"] > 0
    assert stats["regularity_status"] in ["regular", "mild_variation", "irregular", "insufficient_data"]

    # Check prediction
    pred_res = client.get("/api/cycles/prediction", headers=headers)
    assert pred_res.status_code == 200
    pred = pred_res.json()
    assert pred["predicted_start_date"] is not None
    assert pred["uncertainty_days"] >= 1.0
    assert pred["current_phase"] in ["follicular", "ovulation", "luteal", "menstrual"]
