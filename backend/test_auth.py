import requests
import json

url = 'http://localhost:5000/api/auth/register'
headers = {'Content-Type': 'application/json'}
data = {
    'email': 'newuser@test.com',
    'password': 'password123',
    'full_name': 'New Test User'
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f'Status Code: {response.status_code}')
    print(f'Response: {response.text}')
except Exception as e:
    print(f'Error: {e}')
