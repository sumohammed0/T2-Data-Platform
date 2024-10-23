import requests

class PhoneSpecAPI:
    def __init__(self):
        self.base_url = "https://api-mobilespecs.azharimm.dev/v1"

    def fetch_brands(self):
        try:
            response = requests.get(f"{self.base_url}/brands")
            response.raise_for_status()
            return response.json()["data"]
        except requests.RequestException as e:
            print(f"Error fetching brands: {e}")
            return []
