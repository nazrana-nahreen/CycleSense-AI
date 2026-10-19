import pytest


def test_articles_listing_and_filtering(client):
    # List all
    res = client.get("/api/education/articles")
    assert res.status_code == 200
    articles = res.json()
    assert len(articles) >= 5

    # Filter by category
    pcos_res = client.get("/api/education/articles?category=pcos")
    assert pcos_res.status_code == 200
    pcos_arts = pcos_res.json()
    assert len(pcos_arts) >= 1
    assert all(a["category"] == "pcos" for a in pcos_arts)

    # Search keyword
    search_res = client.get("/api/education/articles?q=insulin")
    assert search_res.status_code == 200
    assert len(search_res.json()) >= 1


def test_article_detail_and_sources(client):
    res = client.get("/api/education/articles/pcos-guide")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == "pcos-guide"
    assert "PCOS" in data["title"]
    assert len(data["symptoms"]) > 0
    assert len(data["when_to_consult"]) > 0
    assert len(data["sources"]) > 0
    assert all("url" in s for s in data["sources"])


def test_health_report_summary_endpoint(client, user_a_token):
    headers = {"Authorization": f"Bearer {user_a_token}"}

    # Add cycle and symptom
    client.post("/api/cycles", json={
        "start_date": "2026-03-01",
        "end_date": "2026-03-05",
        "bleeding_intensity": "heavy"
    }, headers=headers)

    client.post("/api/symptoms", json={
        "date": "2026-03-01",
        "cramps_severity": 8,
        "bleeding_flow": "heavy",
        "mood": "anxious"
    }, headers=headers)

    res = client.get("/api/reports/summary", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "user" in data
    assert "stats" in data
    assert "prediction" in data
    assert "notable_patterns" in data
    assert "symptom_summary" in data
    assert "clinical_disclaimer" in data
    assert data["symptom_summary"]["days_with_severe_cramps"] >= 1
