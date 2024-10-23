from .configurations import PHONE_SPEC_API_BASE_URL, PHONE_SPEC_API_KEY
from .phone_spec_client import PhoneSpecApiClient

class PhoneSpecService:
    """Service for interacting with phone specifications."""
    #comment to test
    def __init__(self): 
        self.client = PhoneSpecApiClient(PHONE_SPEC_API_BASE_URL, PHONE_SPEC_API_KEY)

    def get_phone_specs(self, brand: str, model: str) -> dict:
        """Fetch specifications for a specific phone model."""
        try:
            return self.client.get(f"phones/{brand}/{model}")
        except Exception as e:
            print(f"Error fetching phone specs: {e}")
            return None