from typing import Optional, Literal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class SymptomCreate(BaseModel):
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$", description="Format: YYYY-MM-DD")
    cramps_severity: int = Field(0, ge=0, le=10, description="Pain score from 0 to 10")
    bleeding_flow: Literal["none", "light", "medium", "heavy"] = "none"
    mood: Literal["calm", "happy", "anxious", "sad", "irritable", "exhausted"] = "calm"
    acne: bool = False
    bloating: bool = False
    fatigue: bool = False
    headache: bool = False
    sleep_quality: Literal["good", "average", "poor"] = "good"
    notes: Optional[str] = Field(None, max_length=1000)


class SymptomUpdate(BaseModel):
    date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    cramps_severity: Optional[int] = Field(None, ge=0, le=10)
    bleeding_flow: Optional[Literal["none", "light", "medium", "heavy"]] = None
    mood: Optional[Literal["calm", "happy", "anxious", "sad", "irritable", "exhausted"]] = None
    acne: Optional[bool] = None
    bloating: Optional[bool] = None
    fatigue: Optional[bool] = None
    headache: Optional[bool] = None
    sleep_quality: Optional[Literal["good", "average", "poor"]] = None
    notes: Optional[str] = Field(None, max_length=1000)


class SymptomResponse(BaseModel):
    id: int
    user_id: int
    date: str
    cramps_severity: int
    bleeding_flow: str
    mood: str
    acne: bool
    bloating: bool
    fatigue: bool
    headache: bool
    sleep_quality: str
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
