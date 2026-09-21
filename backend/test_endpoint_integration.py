import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app, SessionLocal
from models import User, Cycle, MedicalReport
import json

def test_api_integration():
    client = TestClient(app)
    db = SessionLocal()

    # Create test user
    username = "audit_user_pcos"
    existing = db.query(User).filter(User.username == username).first()
    if existing:
        db.query(Cycle).filter(Cycle.user_id == existing.id).delete()
        db.query(MedicalReport).filter(MedicalReport.user_id == existing.id).delete()
        db.delete(existing)
        db.commit()

    # Register user with PCOS symptoms
    signup_payload = {
        "username": username,
        "password": "password123",
        "email": "audit_user@example.com",
        "age": 26,
        "height": 162.0,
        "weight": 72.0,  # BMI = 27.4 (overweight +8)
        "country": "India",
        "intent": "Detect PCOS / PCOD",
        "cycle_regularity": "No",  # Irregular (+25)
        "pregnancy_mode": False,
        "birth_control": "None",
        "health_conditions": ["PCOS"],  # Reported history (+20)
        "symptom_baseline": ["Mood Swings", "Fatigue"],  # Mental health load (+3)
        "sexual_activity": "Yes",
        "sleep_hours": 6.5,
        "activity_level": "Sedentary",  # Inactive (+4)
        "lifestyle_habits": ["Skin", "Diet"]  # Skin (+10), Diet (+2)
    }

    res_signup = client.post("/auth/signup", json=signup_payload)
    assert res_signup.status_code == 200, f"Signup failed: {res_signup.text}"

    # Log in
    res_login = client.post("/auth/login", data={"username": username, "password": "password123"})
    assert res_login.status_code == 200, f"Login failed: {res_login.text}"
    token = res_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Call /ai/predict-risk
    res_predict = client.post("/ai/predict-risk", json={}, headers=headers)
    assert res_predict.status_code == 200, f"Predict failed: {res_predict.text}"
    data = res_predict.json()

    print("\n--- API ENDPOINT /ai/predict-risk INTEGRATION TEST ---")
    print(f"Status Code: {res_predict.status_code}")
    print(f"Hormone Health Score (compatibility): {data['hormone_health_score']}")
    print(f"PCOS Risk Binary (compatibility): {data['pcos_risk_binary']}")
    print(f"Screening Risk Score: {data['screening_risk_score']}")
    print(f"Hormone Health Index: {data['hormone_health_index']}")
    print(f"Risk Category: {data['risk_category']}")
    print(f"Assessment Status: {data['assessment_status']}")
    print(f"Is Diagnostic: {data['is_diagnostic']}")
    print(f"Reported PCOS History: {data['reported_pcos_history']}")
    print("\nBreakdown:")
    for k, v in data["breakdown"].items():
        print(f"  {k}: {v['score']}/{v['max']} -> {v['evidence']}")

    # Verification checks
    assert data["reported_pcos_history"] is True
    assert data["is_diagnostic"] is False
    assert data["hormone_health_score"] < 50, f"Expected score < 50 for severe multi-symptom profile, got {data['hormone_health_score']}"
    assert data["screening_risk_score"] >= 60, f"Expected high screening risk, got {data['screening_risk_score']}"
    assert data["risk_category"] == "High Screening Risk"
    assert data["assessment_status"] == "PRELIMINARY_ONBOARDING_ONLY"

    print("\n[PASS] API INTEGRATION TEST VERIFIED! No more 99/100 for symptomatic profiles!")
    return True

if __name__ == "__main__":
    success = test_api_integration()
    sys.exit(0 if success else 1)
