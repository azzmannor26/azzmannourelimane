from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from datetime import datetime
import pandas as pd

from src.data_loader import load_stagiaires, load_stages, load_hr_requirements
from src.preprocessing import preprocess_data
from src.visualizations import plot_interns_per_month, plot_department_distribution, plot_paid_vs_unpaid, plot_stipend_distribution, plot_duration_distribution
from src.model import train_predict_model, predict_number_of_interns
from src.recommender import recommend_profiles

app = FastAPI()

# Mount templates and static assets
templates = Jinja2Templates(directory="templates")
app.mount("/plots", StaticFiles(directory="/tmp/plots"), name="plots")

# Load and preprocess data once at startup
stagiaires = load_stagiaires()
stages = load_stages()
hr_reqs = load_hr_requirements()
merged_data, cleaned_hr_reqs = preprocess_data(stagiaires, stages, hr_reqs)

model, encoder, mse = train_predict_model(cleaned_hr_reqs)

# === API SCHEMAS ===
class HRRequest(BaseModel):
    month: str
    department: str
    needed_skills: list[str]
    urgency_level: str

# === ROUTES ===
@app.get("/", response_class=HTMLResponse)
def read_dashboard(request: Request):
    # Render stats
    plot_interns_per_month(merged_data)
    plot_department_distribution(merged_data)
    plot_paid_vs_unpaid(merged_data)
    plot_stipend_distribution(merged_data)
    plot_duration_distribution(merged_data)
    return templates.TemplateResponse("dashboard.html", {"request": request})

@app.post("/predict")
def predict(hr_input: HRRequest):
    new_df = pd.DataFrame([{
        "month": pd.to_datetime(hr_input.month),
        "department": hr_input.department,
        "needed_skills": hr_input.needed_skills,
        "urgency_level": hr_input.urgency_level,
        "num_interns": 0,
        "created_at": datetime.now()
    }])
    prediction = predict_number_of_interns(model, encoder, new_df)
    return {"predicted_interns": round(prediction[0])}

@app.post("/recommend")
def recommend(hr_input: HRRequest):
    new_df = pd.DataFrame([{
        "month": pd.to_datetime(hr_input.month),
        "department": hr_input.department,
        "needed_skills": hr_input.needed_skills,
        "urgency_level": hr_input.urgency_level,
        "num_interns": 0,
        "created_at": datetime.now()
    }])
    recs = recommend_profiles(new_df, merged_data).to_dict(orient='records')
    return {"recommended_profiles": recs}
