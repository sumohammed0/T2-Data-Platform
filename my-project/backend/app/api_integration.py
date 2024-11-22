# app/api_integration.py
import requests
from typing import Dict, Any
from datetime import datetime
from pydantic import BaseModel
from fastapi import HTTPException

class APIRequest(BaseModel):
    endpoint: str
    method: str
    headers: Dict[str, str] = {}
    params: Dict[str, str] = {}

class APIIntegrationService:
    def execute_request(self, config: APIRequest) -> Dict[str, Any]:
        try:
            # Make the HTTP request
            response = requests.request(
                method=config.method,
                url=config.endpoint,
                headers=config.headers,
                params=config.params,
                timeout=30
            )
            
            # Try to parse response as JSON
            try:
                response_data = response.json()
            except ValueError:
                response_data = response.text
            
            return {
                "status": "success",
                "statusCode": response.status_code,
                "data": response_data,
                "timestamp": datetime.now().isoformat()
            }
                
        except requests.exceptions.RequestException as e:
            # Handle any request-related errors
            error_message = str(e)
            if "SSLError" in error_message:
                error_message = "SSL Error - Could not verify the API endpoint's security certificate"
            elif "ConnectionError" in error_message:
                error_message = "Connection Error - Could not reach the API endpoint"
            elif "Timeout" in error_message:
                error_message = "Timeout Error - The API request took too long to respond"
            
            return {
                "status": "error",
                "message": error_message,
                "timestamp": datetime.now().isoformat()
            }