import datetime
from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.period import PeriodCycle
from app.models.symptom import DailySymptom
from app.schemas.report import HealthReportSummaryResponse
from app.schemas.user import UserResponse
from app.schemas.period import PeriodResponse
from app.schemas.symptom import SymptomResponse
from app.services.cycle_analytics import (
    calculate_cycle_stats,
    calculate_cycle_prediction,
    analyze_notable_patterns,
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/reports", tags=["Health Reports"])


@router.get(
    "/summary",
    response_model=HealthReportSummaryResponse,
    summary="Get aggregated health and cycle consultation report for authenticated user"
)
def get_report_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cycles = (
        db.query(PeriodCycle)
        .filter(PeriodCycle.user_id == current_user.id)
        .order_by(PeriodCycle.start_date.desc())
        .all()
    )
    symptoms = (
        db.query(DailySymptom)
        .filter(DailySymptom.user_id == current_user.id)
        .order_by(DailySymptom.date.desc())
        .all()
    )

    stats = calculate_cycle_stats(cycles)
    prediction = calculate_cycle_prediction(
        cycles,
        fallback_cycle_length=current_user.cycle_length_days,
        fallback_period_duration=current_user.period_duration_days
    )
    patterns = analyze_notable_patterns(cycles, symptoms)

    # Symptom frequency analysis
    cramp_days = sum(1 for s in symptoms if s.cramps_severity >= 1)
    severe_cramp_days = sum(1 for s in symptoms if s.cramps_severity >= 7)
    heavy_flow_days = sum(1 for s in symptoms if s.bleeding_flow == "heavy")
    mood_counts = Counter(s.mood for s in symptoms)
    top_mood = mood_counts.most_common(1)[0][0] if mood_counts else "calm"

    symptom_summary = {
        "total_days_logged": len(symptoms),
        "days_with_cramps": cramp_days,
        "days_with_severe_cramps": severe_cramp_days,
        "days_with_heavy_bleeding": heavy_flow_days,
        "predominant_mood": top_mood,
    }

    return HealthReportSummaryResponse(
        user=UserResponse.model_validate(current_user),
        stats=stats,
        prediction=prediction,
        notable_patterns=patterns,
        recent_cycles=[PeriodResponse.model_validate(c) for c in cycles[:6]],
        recent_symptoms=[SymptomResponse.model_validate(s) for s in symptoms[:14]],
        symptom_summary=symptom_summary,
        generated_at=datetime.datetime.utcnow().isoformat(),
        clinical_disclaimer="CycleSense AI is an educational tracking companion and does not constitute medical diagnosis or replace personalized care from a qualified gynecologist or healthcare physician."
    )
