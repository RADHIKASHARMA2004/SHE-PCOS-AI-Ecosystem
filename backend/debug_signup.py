from fastapi.testclient import TestClient
from main import app

try:
    client = TestClient(app)
    response = client.post('/auth/signup', json={
        'username': 'testuser8', 'password': '123', 'email': '', 'age': 25, 'height': 160, 'weight': 60,
        'country': 'US', 'intent': 'Track Period', 'cycle_regularity': 'Unknown', 'pregnancy_mode': False,
        'birth_control': 'None', 'health_conditions': [], 'symptom_baseline': [], 'sexual_activity': 'Unknown',
        'sleep_hours': 7.0, 'activity_level': 'Sedentary', 'lifestyle_habits': []
    })
    print('STATUS', response.status_code)
    print(response.text)
except Exception as e:
    import traceback
    traceback.print_exc()
