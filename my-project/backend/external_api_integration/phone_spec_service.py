from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from api_integration import PhoneSpecAPI
from phone_spec_db import init_db, insert_phone, get_all_phones

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
init_db()

# Initialize API client
phone_spec_api = PhoneSpecAPI()

# Fetch and store data from the API
def fetch_and_store_data():
    brands = phone_spec_api.fetch_brands()
    for brand in brands:
        insert_phone(brand["brand_name"], "N/A")

# Schedule the job to run every 24 hours
scheduler = BackgroundScheduler()
scheduler.add_job(fetch_and_store_data, "interval", hours=24)
scheduler.start()

# API endpoint to get phone data
@app.get("/phones")
def get_phones():
    return {"phones": get_all_phones()}

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
