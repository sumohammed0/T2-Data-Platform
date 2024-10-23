from abc import ABC, abstractmethod

class ApiClient(ABC):
    """Interface for API Clients."""
    #comment to test
    @abstractmethod 
    def get(self, endpoint: str, params: dict = None) -> dict:
        """Send a GET request to the API."""
        pass

    @abstractmethod
    def post(self, endpoint: str, data: dict = None) -> dict:
        """Send a POST request to the API."""
        pass

    @abstractmethod
    def put(self, endpoint: str, data: dict = None) -> dict:
        """Send a PUT request to the API."""
        pass

    @abstractmethod
    def delete(self, endpoint: str) -> dict:
        """Send a DELETE request to the API."""
        pass