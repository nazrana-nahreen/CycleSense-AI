import pytest


def test_avatar_upload_endpoint(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    sample_avatar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    res = client.post("/api/users/avatar", json={"avatar_url": sample_avatar}, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["avatar_url"] == sample_avatar

    # Verify reflected in /api/auth/me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.json()["avatar_url"] == sample_avatar


def test_partner_sharing_invite_and_shared_view(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    # First add a cycle so prediction exists
    client.post("/api/cycles", json={
        "start_date": "2026-10-01",
        "end_date": "2026-10-05",
        "bleeding_intensity": "medium"
    }, headers=headers)

    # 1. User configures partner sharing
    invite_payload = {
        "partner_name": "Tanvir",
        "partner_email": "tanvir@example.com",
        "permissions": {
            "sharePeriodDates": True,
            "shareCyclePhase": True,
            "shareMoodAndSymptoms": False,
            "shareDailyTips": True,
        }
    }
    invite_res = client.post("/api/users/partner/invite", json=invite_payload, headers=headers)
    assert invite_res.status_code == 200
    user_data = invite_res.json()
    assert user_data["partner_sharing_enabled"] is True
    assert user_data["partner_name"] == "Tanvir"
    assert user_data["partner_code"] is not None
    assert user_data["partner_code"].startswith("CYCLE-")
    partner_code = user_data["partner_code"]

    # 2. Partner accesses shared read-only view using code (no login required!)
    shared_view_res = client.get(f"/api/users/partner/shared/{partner_code}")
    assert shared_view_res.status_code == 200
    view_data = shared_view_res.json()
    assert view_data["sharing_active"] is True
    assert view_data["partner_name"] == "Tanvir"
    assert view_data["current_phase"] is not None
    assert "partner_care_tip" in view_data
    assert len(view_data["partner_care_tip"]) > 0

    # 3. User revokes partner access
    revoke_res = client.post("/api/users/partner/revoke", headers=headers)
    assert revoke_res.status_code == 200
    assert revoke_res.json()["partner_sharing_enabled"] is False

    # 4. Old code must now be rejected (404)
    revoked_view_res = client.get(f"/api/users/partner/shared/{partner_code}")
    assert revoked_view_res.status_code == 404
