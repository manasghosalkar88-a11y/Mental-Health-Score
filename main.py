import os
from pathlib import Path
import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / 'Mental_Health_Model.pkl'

model = joblib.load(MODEL_PATH)

app = FastAPI(title="MindScope AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



#A First model
class Student_data(BaseModel):
    age                     : int = Field(..., ge=10, le=100)
    gender                  : Literal['Male', 'Female']
    country                 : str
    academic_level          : Literal['Undergraduate', 'Graduate', 'High School']
    most_used_platform      : Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat','Twitter','YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp','WeChat']
    purpose_of_use          : Literal['Networking', 'Education', 'Entertainment', 'News']
    avg_daily_usage_hours   : float = Field(..., ge=0, le=24)
    daily_unlocks           : int   = Field(..., ge=0)
    study_hours             : float = Field(..., ge=0, le=24)
    physical_activity_hours : float = Field(..., ge=0, le=24)
    sleep_hours_per_night   : float = Field(..., ge=0, le=24)
    stress_level            : Literal['Medium', 'Low', 'Very High', 'High']

#Discribe What we Send Back
class PredictionResponse(BaseModel):
    predicted_Mental_Health_Score : float

@app.get('/')
def greet():
    return {"message": "Hello from MindScope AI Backend"}

@app.get('/health')
def health():
    return {"status": "ok", "message": "MindScope AI Backend is healthy"}

top_countries = ['Other','India','USA','Canada','Australia','UK','Germany','Mexico','Turkey','France']

@app.post('/predict', response_model=PredictionResponse)
def predict(data: Student_data):
    country_group = data.country if data.country in top_countries else "Other"
    input_rows = pd.DataFrame([{
        'Age'                       :data.age,
        'Gender'                    :data.gender,
        'Country'                   :data.country,
        'Academic_Level'            :data.academic_level,
        'Most_Used_Platform'        :data.most_used_platform,
        'Purpose_Of_Use'            :data.purpose_of_use,
        'Avg_Daily_Usage_Hours'     :data.avg_daily_usage_hours,
        'Daily_Unlocks'             :data.daily_unlocks,
        'Study_Hours'               :data.study_hours,
        'Physical_Activity_Hours'   :data.physical_activity_hours,
        'Sleep_Hours_Per_Night'     :data.sleep_hours_per_night,
        'Stress_Level'              :data.stress_level,
        'Grouped_country'           :country_group,
        'grouped_countries'         :country_group
    }])

    predict = model.predict(input_rows)[0]
    return PredictionResponse(predicted_Mental_Health_Score=round(float(predict),2))

if __name__ == '__main__':
    import uvicorn
    print("\n" + "=" * 60)
    print(">>> Starting MindScope AI FastAPI Backend...")
    print(">>> URL: http://127.0.0.1:2200")
    print(">>> Swagger Docs: http://127.0.0.1:2200/docs")
    print("=" * 60 + "\n")
    uvicorn.run("main:app", host="127.0.0.1", port=2200, reload=True)