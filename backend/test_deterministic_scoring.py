import json
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import calculate_pcos_screening_score, app
from fastapi.testclient import TestClient

def run_deterministic_tests():
    print("=" * 80)
    print("SHE PCOS AI ECOSYSTEM: DETERMINISTIC SCORING ENGINE AUDIT & VERIFICATION")
    print("=" * 80)

    test_cases = [
        {
            "id": 1,
            "name": "Completely missing clinical data + cycle regularity unknown",
            "user_data": {
                "age": 25,
                "cycle_regularity": "Unknown",
                "health_conditions": [],
                "lifestyle_habits": [],
                "symptom_baseline": [],
                "activity_level": None,
                "sleep_hours": None,
                "bmi": None
            },
            "cycles_data": [],
            "biomarkers_data": {},
            "expected": {
                "d1": 5, "d2": 0, "d3": 0, "d4": 0,
                "risk": 5, "health": 95,
                "category": "Low Screening Risk",
                "status": "PRELIMINARY_ONBOARDING_ONLY"
            }
        },
        {
            "id": 2,
            "name": "Healthy profile",
            "user_data": {
                "age": 25,
                "cycle_regularity": "Yes",
                "bmi": 21.5,
                "activity_level": "Active",
                "sleep_hours": 8.0,
                "health_conditions": [],
                "lifestyle_habits": [],
                "symptom_baseline": []
            },
            "cycles_data": [],
            "biomarkers_data": {},
            "expected": {
                "d1": 0, "d2": 0, "d3": 0, "d4": 0,
                "risk": 0, "health": 100,
                "category": "Low Screening Risk",
                "status": "PRELIMINARY_ONBOARDING_ONLY"
            }
        },
        {
            "id": 3,
            "name": "Irregular cycles",
            "user_data": {
                "age": 25,
                "cycle_regularity": "No",
                "bmi": 22.0,
                "sleep_hours": 7.5,
                "activity_level": "Moderate",
                "health_conditions": [],
                "lifestyle_habits": [],
                "symptom_baseline": []
            },
            "cycles_data": [],
            "biomarkers_data": {},
            "expected": {
                "d1": 25, "d2": 0, "d3": 0, "d4": 0,
                "risk": 25, "health": 75,
                "category": "Low Screening Risk",
                "status": "PRELIMINARY_ONBOARDING_ONLY"
            }
        },
        {
            "id": 4,
            "name": "Reported PCOS history only",
            "user_data": {
                "age": 25,
                "cycle_regularity": "Yes",
                "health_conditions": ["PCOS"],
                "bmi": 22.0,
                "sleep_hours": 7.5,
                "activity_level": "Moderate",
                "lifestyle_habits": [],
                "symptom_baseline": []
            },
            "cycles_data": [],
            "biomarkers_data": {},
            "expected": {
                "d1": 0, "d2": 0, "d3": 20, "d4": 0,
                "risk": 20, "health": 80,
                "category": "Low Screening Risk",
                "reported_pcos_history": True
            }
        },
        {
            "id": 5,
            "name": "Reported PCOS + irregular cycles",
            "user_data": {
                "age": 25,
                "cycle_regularity": "No",
                "health_conditions": ["PCOS"],
                "bmi": 22.0,
                "sleep_hours": 7.5,
                "activity_level": "Moderate",
                "lifestyle_habits": [],
                "symptom_baseline": []
            },
            "cycles_data": [],
            "biomarkers_data": {},
            "expected": {
                "d1": 25, "d2": 0, "d3": 20, "d4": 0,
                "risk": 45, "health": 55,
                "category": "Moderate Screening Risk",
                "reported_pcos_history": True
            }
        },
        {
            "id": 6,
            "name": "Mental-health symptoms only",
            "user_data": {
                "age": 25,
                "cycle_regularity": "Yes",
                "health_conditions": [],
                "lifestyle_habits": [],
                "symptom_baseline": ["Mood Swings", "Anxiety", "Fatigue"],
                "bmi": 22.0,
                "activity_level": "Moderate",
                "sleep_hours": 6.5
            },
            "cycles_data": [],
            "biomarkers_data": {},
            "expected": {
                "d1": 0, "d2": 0, "d3": 0, "d4": 3,
                "risk": 3, "health": 97,
                "category": "Low Screening Risk"
            }
        },
        {
            "id": 7,
            "name": "Reported skin concern + tracked acne >6",
            "user_data": {
                "age": 25,
                "cycle_regularity": "Yes",
                "lifestyle_habits": ["Skin"],
                "health_conditions": [],
                "symptom_baseline": [],
                "bmi": 22.0,
                "activity_level": "Moderate",
                "sleep_hours": 7.5
            },
            "cycles_data": [
                {"start_date": "2026-01-01", "acne_scale": 8, "hair_loss_scale": 1},
                {"start_date": "2026-01-29", "acne_scale": 7, "hair_loss_scale": 1}
            ],
            "biomarkers_data": {},
            "expected": {
                "d1": 0, "d2": 25, "d3": 0, "d4": 0,
                "risk": 25, "health": 75,
                "category": "Low Screening Risk"
            }
        },
        {
            "id": 8,
            "name": "Good lifestyle + reported PCOS + irregular",
            "user_data": {
                "age": 25,
                "cycle_regularity": "No",
                "health_conditions": ["PCOS"],
                "sleep_hours": 8.0,
                "activity_level": "Active",
                "bmi": 22.0,
                "lifestyle_habits": [],
                "symptom_baseline": []
            },
            "cycles_data": [],
            "biomarkers_data": {},
            "expected": {
                "d1": 25, "d2": 0, "d3": 20, "d4": 0,
                "risk": 45, "health": 55,
                "category": "Moderate Screening Risk"
            }
        },
        {
            "id": 9,
            "name": "Ultrasound positive findings",
            "user_data": {
                "age": 25,
                "cycle_regularity": "Yes",
                "health_conditions": [],
                "lifestyle_habits": [],
                "symptom_baseline": [],
                "bmi": 22.0,
                "sleep_hours": 7.5,
                "activity_level": "Moderate"
            },
            "cycles_data": [],
            "biomarkers_data": {
                "follicle_count": 15,
                "ovarian_volume": 12.0
            },
            "expected": {
                "d1": 0, "d2": 0, "d3": 20, "d4": 0,
                "risk": 20, "health": 80,
                "category": "Low Screening Risk",
                "status": "CLINICAL_DATA_AVAILABLE"
            }
        },
        {
            "id": 10,
            "name": "Biochemical hyperandrogenism (lab ref)",
            "user_data": {
                "age": 25,
                "cycle_regularity": "Yes",
                "health_conditions": [],
                "lifestyle_habits": [],
                "symptom_baseline": [],
                "bmi": 22.0,
                "sleep_hours": 7.5,
                "activity_level": "Moderate"
            },
            "cycles_data": [],
            "biomarkers_data": {
                "testosterone": 72.0,
                "testosterone_ref_high": 50.0
            },
            "expected": {
                "d1": 0, "d2": 25, "d3": 0, "d4": 0,
                "risk": 25, "health": 75,
                "category": "Low Screening Risk",
                "status": "CLINICAL_DATA_AVAILABLE"
            }
        }
    ]

    all_passed = True

    for tc in test_cases:
        print(f"\n--- TEST #{tc['id']}: {tc['name']} ---")
        result = calculate_pcos_screening_score(tc["user_data"], tc["cycles_data"], tc["biomarkers_data"])
        
        d1 = result["breakdown"]["menstrual_ovulatory"]["score"]
        d2 = result["breakdown"]["hyperandrogenism"]["score"]
        d3 = result["breakdown"]["reported_clinical_history"]["score"]
        d4 = result["breakdown"]["metabolic_lifestyle"]["score"]
        risk = result["screening_risk_score"]
        health = result["hormone_health_index"]
        cat = result["risk_category"]
        status = result["assessment_status"]
        is_diag = result["is_diagnostic"]

        print(f"  [Domain 1: Menstrual / Ovulatory] : {d1}/35 -> {result['breakdown']['menstrual_ovulatory']['evidence']}")
        print(f"  [Domain 2: Hyperandrogenism]      : {d2}/25 -> {result['breakdown']['hyperandrogenism']['evidence']}")
        print(f"  [Domain 3: Clinical History]      : {d3}/20 -> {result['breakdown']['reported_clinical_history']['evidence']}")
        print(f"  [Domain 4: Metabolic & Lifestyle] : {d4}/20 (Gross: {result['breakdown']['metabolic_lifestyle']['gross_burden']}, Mitig: {result['breakdown']['metabolic_lifestyle']['protective_mitigation']}) -> {result['breakdown']['metabolic_lifestyle']['evidence']}")
        print(f"  => TOTAL RISK SCORE : {risk}/100 | HORMONE HEALTH INDEX: {health}/100")
        print(f"  => CLASSIFICATION   : {cat} | STATUS: {status} | IS_DIAGNOSTIC: {is_diag}")

        # Assertions
        exp = tc["expected"]
        passed = True
        if d1 != exp["d1"]:
            print(f"  [FAIL] D1: expected {exp['d1']}, got {d1}")
            passed = False
        if d2 != exp["d2"]:
            print(f"  [FAIL] D2: expected {exp['d2']}, got {d2}")
            passed = False
        if d3 != exp["d3"]:
            print(f"  [FAIL] D3: expected {exp['d3']}, got {d3}")
            passed = False
        if d4 != exp["d4"]:
            print(f"  [FAIL] D4: expected {exp['d4']}, got {d4}")
            passed = False
        if risk != exp["risk"]:
            print(f"  [FAIL] Risk Score: expected {exp['risk']}, got {risk}")
            passed = False
        if health != exp["health"]:
            print(f"  [FAIL] Health Index: expected {exp['health']}, got {health}")
            passed = False
        if cat != exp["category"]:
            print(f"  [FAIL] Category: expected {exp['category']}, got {cat}")
            passed = False
        if "status" in exp and status != exp["status"]:
            print(f"  [FAIL] Status: expected {exp['status']}, got {status}")
            passed = False
        if is_diag is not False:
            print(f"  [FAIL] is_diagnostic must be False")
            passed = False

        if passed:
            print(f"  [PASS] ALL ASSERTIONS MATCHED")
        else:
            all_passed = False

    print("\n" + "=" * 80)
    if all_passed:
        print("ALL 10 DETERMINISTIC CLINICAL TEST SCENARIOS PASSED WITH EXACT SCORES!")
    else:
        print("SOME TESTS FAILED! CHECK OUTPUT ABOVE.")
    print("=" * 80)

    return all_passed

if __name__ == "__main__":
    success = run_deterministic_tests()
    sys.exit(0 if success else 1)
