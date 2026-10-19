from typing import Optional, Literal
from datetime import datetime, date
from pydantic import BaseModel, Field, field_validator, ConfigDict


class PeriodCreate(BaseModel):
    start_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Format: YYYY-MM-DD")
    end_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Format: YYYY-MM-DD")
    bleeding_intensity: Literal["light", "medium", "heavy"] = "medium"
    notes: Optional[str] = Field(None, max_length=1000)

    @field_validator("end_date")
    @classmethod
    def validate_date_order(cls, v: str, info) -> str:
        if "start_date" in info.data:
            start_str = info.data["start_date"]
            try:
                start = date.fromisoformat(start_str)
                end = date.fromisoformat(v)
                if end < start:
                    raise ValueError("End date cannot precede start date.")
                if (end - start).days > 20:
                    raise ValueError("Period duration cannot exceed 20 days.")
            except ValueError as e:
                raise e
        return v


class PeriodUpdate(BaseModel):
    start_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    end_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    bleeding_intensity: Optional[Literal["light", "medium", "heavy"]] = None
    notes: Optional[str] = Field(None, max_length=1000)


class PeriodResponse(BaseModel):
    id: int
    user_id: int
    start_date: str
    end_date: str
    period_length: int
    cycle_length: Optional[int] = None
    bleeding_intensity: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CycleStatsResponse(BaseModel):
    average_cycle_length: float
    average_period_duration: float
    cycle_variation: float
    regularity_status: Literal["regular", "mild_variation", "irregular", "insufficient_data"]
    total_cycles_recorded: int
    min_cycle_length: Optional[int] = None
    max_cycle_length: Optional[int] = None


class CyclePredictionResponse(BaseModel):
    predicted_start_date: Optional[str] = None
    predicted_end_date: Optional[str] = None
    uncertainty_days: float = 2.5
    cycle_day: Optional[int] = None
    current_phase: Literal["follicular", "ovulation", "luteal", "menstrual", "unknown"] = "unknown"
