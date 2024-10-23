import unittest
from unittest.mock import patch
from .phone_spec_client import PhoneSpecApiClient

class TestPhoneSpecApiClient(unittest.TestCase):
    #comment to test
    @patch('requests.get')
    def test_get_phone_specs_success(self, mock_get):
        mock_response = {
            "brand": "Apple",
            "model": "iPhone 13",
            "specifications": {"display": "6.1 inches"}
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        client = PhoneSpecApiClient("https://api.phone-specs.com", "test_api_key")
        result = client.get("phones/apple/iphone-13")

        self.assertEqual(result['brand'], "Apple")
        self.assertEqual(result['model'], "iPhone 13")
        self.assertIn("specifications", result)

    @patch('requests.get')
    def test_get_phone_specs_failure(self, mock_get):
        mock_get.return_value.status_code = 404
        mock_get.return_value.text = "Not Found"

        client = PhoneSpecApiClient("https://api.phone-specs.com", "test_api_key")

        with self.assertRaises(Exception):
            client.get("phones/unknown/unknown-model")

if __name__ == '__main__':
    unittest.main()