import requests

payload = {
    'username': 'fresh_user2', 'password': '123', 'email': '', 'age': 25, 'height': 160, 'weight': 60,
    'country': 'US', 'intent': 'Track Period', 'cycle_regularity': 'Unknown', 'pregnancy_mode': False,
    'birth_control': 'None', 'health_conditions': [], 'symptom_baseline': [], 'sexual_activity': 'Unknown',
    'sleep_hours': 7.0, 'activity_level': 'Sedentary', 'lifestyle_habits': []
}

response = requests.post('http://127.0.0.1:8000/auth/signup', json=payload)
print("STATUS", response.status_code)
print(response.text)
