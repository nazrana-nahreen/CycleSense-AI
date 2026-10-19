from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.schemas.period import CycleStatsResponse, CyclePredictionResponse, PeriodResponse
from app.schemas.symptom import SymptomResponse
from app.schemas.user import UserResponse


class HealthReportSummaryResponse(BaseModel):
    user: UserResponse
    stats: CycleStatsResponse
    prediction: CyclePredictionResponse
    notable_patterns: List[str]
    recent_cycles: List[PeriodResponse]
    recent_symptoms: List[SymptomResponse]
    symptom_summary: Dict[str, Any]
    generated_at: str
    clinical_disclaimer: str
