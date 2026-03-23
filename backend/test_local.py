import sys
import traceback
from main import signup, SessionLocal

user_payload = {
    'username': 'fresh_direct1', 'password': '123', 'email': '', 'age': 25, 'height': 160, 'weight': 60,
    'country': 'US', 'intent': 'Track Period', 'cycle_regularity': 'Unknown', 'pregnancy_mode': False,
    'birth_control': 'None', 'health_conditions': [], 'symptom_baseline': [], 'sexual_activity': 'Unknown',
    'sleep_hours': 7.0, 'activity_level': 'Sedentary', 'lifestyle_habits': []
}

db = SessionLocal()
try:
    res = signup(user_payload, db)
    print("RESULT:", res)
except Exception as e:
    print("EXCEPTION CAUGHT:")
    traceback.print_exc()
