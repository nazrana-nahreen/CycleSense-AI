import os
import json
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/ml", tags=["Machine Learning Predictions"])

WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "..", "ml", "models", "cycle_model_weights.json")

def load_model_weights() -> Dict[str, Any]:
    if not os.path.exists(WEIGHTS_PATH):
        raise HTTPException(status_code=500, detail="ML model weights file not found. Model training required.")
    with open(WEIGHTS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

class PredictRequest(BaseModel):
    mean_cycle_length: float = Field(28.0, ge=18.0, le=60.0, description="User's historical average cycle duration in days")
    mean_menses_length: float = Field(5.0, ge=1.0, le=14.0, description="Average bleeding days")
    age: Optional[float] = Field(30.0, ge=15.0, le=60.0, description="Chronological age")
    bmi: Optional[float] = Field(24.0, ge=14.0, le=55.0, description="Body Mass Index")
    recent_cycle_lengths: Optional[List[float]] = Field(default=[], description="List of recent recorded cycle lengths")

class PredictResponse(BaseModel):
    model_name: str
    predicted_cycle_length: float
    predicted_period_duration: float
    estimated_ovulation_day: int
    fertile_window_start: int
    fertile_window_end: int
    uncertainty_days: float
    confidence_percentage: float
    feature_contributions: Dict[str, float]
    clinical_reference: str

@router.get("/model-info")
def get_model_info():
    """
    Returns verified clinical dataset training metadata and evaluation metrics.
    """
    model_data = load_model_weights()
    return {
        "model_name": model_data.get("model_name"),
        "dataset_name": model_data.get("dataset_name"),
        "dataset_samples": model_data.get("dataset_samples"),
        "evaluation_metrics": model_data.get("evaluation_metrics"),
        "feature_importances": model_data.get("feature_importances"),
        "features": model_data.get("features"),
        "trained_at": model_data.get("trained_at")
    }

@router.post("/predict", response_model=PredictResponse)
def predict_cycle(req: PredictRequest):
    """
    Performs inference using the trained Ridge Regression model weights.
    """
    model_data = load_model_weights()
    weights = model_data["weights"]
    metrics = model_data["evaluation_metrics"]

    # If recent cycles exist, calculate weighted moving average
    baseline_length = req.mean_cycle_length
    if req.recent_cycle_lengths and len(req.recent_cycle_lengths) >= 1:
        # Give higher weight to the most recent cycle
        weights_recent = [i + 1 for i in range(len(req.recent_cycle_lengths))]
        weighted_sum = sum(w * val for w, val in zip(weights_recent, req.recent_cycle_lengths))
        baseline_length = weighted_sum / sum(weights_recent)

    # Feature vector: [1, mean_cycle_length, (age - 30)/10, (bmi - 24)/5, mean_menses_length - 5]
    norm_age = ((req.age or 30.0) - 30.0) / 10.0
    norm_bmi = ((req.bmi or 24.0) - 24.0) / 5.0
    menses_dev = req.mean_menses_length - 5.0

    contrib_bias = weights["bias"]
    contrib_mean = weights["historical_mean_cycle_length"] * baseline_length
    contrib_age = weights["normalized_age"] * norm_age
    contrib_bmi = weights["normalized_bmi"] * norm_bmi
    contrib_menses = weights["menses_duration_deviation"] * menses_dev

    raw_pred = contrib_bias + contrib_mean + contrib_age + contrib_bmi + contrib_menses
    predicted_cycle_length = round(max(20.0, min(50.0, raw_pred)), 1)

    # Estimated Ovulation: Cycle Length - Mean Luteal Phase (12.0 days from clinical data)
    luteal_mean = metrics.get("mean_luteal_phase_days", 12.0)
    est_ovulation = max(9, int(round(predicted_cycle_length - luteal_mean)))

    # Fertile Window: 5 days prior to ovulation + day of ovulation
    fertile_start = max(6, est_ovulation - 5)
    fertile_end = est_ovulation + 1

    # Predicted menses duration
    predicted_menses = round(max(2.0, min(9.0, req.mean_menses_length * 0.9 + metrics.get("mean_menses_days", 4.9) * 0.1)), 1)

    # Uncertainty from residual standard error
    uncertainty_days = max(1.5, metrics.get("empirical_90pct_uncertainty_days", 1.8))
    confidence_pct = round(max(75.0, min(98.0, metrics.get("r2_score", 0.95) * 100 - (uncertainty_days * 3))), 1)

    return PredictResponse(
        model_name=model_data["model_name"],
        predicted_cycle_length=predicted_cycle_length,
        predicted_period_duration=predicted_menses,
        estimated_ovulation_day=est_ovulation,
        fertile_window_start=fertile_start,
        fertile_window_end=fertile_end,
        uncertainty_days=uncertainty_days,
        confidence_percentage=confidence_pct,
        feature_contributions={
            "baseline_cycle_cadence": round(contrib_mean, 2),
            "age_factor": round(contrib_age, 2),
            "bmi_factor": round(contrib_bmi, 2),
            "menses_duration_factor": round(contrib_menses, 2)
        },
        clinical_reference=model_data["dataset_name"]
    )
