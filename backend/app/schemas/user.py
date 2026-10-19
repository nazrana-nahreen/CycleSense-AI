from typing import Optional, Literal, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    preferred_language: str
    privacy_mode: bool
    cycle_length_days: int
    period_duration_days: int
    reminder_enabled: bool
    avatar_url: Optional[str] = None
    partner_sharing_enabled: bool = False
    partner_name: Optional[str] = None
    partner_email: Optional[str] = None
    partner_code: Optional[str] = None
    partner_status: str = "inactive"
    partner_permissions_json: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    preferred_language: Optional[Literal["en", "bn"]] = None
    privacy_mode: Optional[bool] = None
    cycle_length_days: Optional[int] = Field(None, ge=18, le=60)
    period_duration_days: Optional[int] = Field(None, ge=1, le=14)
    reminder_enabled: Optional[bool] = None
    avatar_url: Optional[str] = None
    partner_sharing_enabled: Optional[bool] = None
    partner_name: Optional[str] = None
    partner_email: Optional[str] = None
    partner_code: Optional[str] = None
    partner_status: Optional[str] = None
    partner_permissions_json: Optional[str] = None


class AvatarUploadRequest(BaseModel):
    avatar_url: str = Field(..., description="Base64 Data URI or image URL for profile avatar")


class PartnerInviteRequest(BaseModel):
    partner_name: Optional[str] = None
    partner_email: Optional[EmailStr] = None
    permissions: Optional[Dict[str, bool]] = None


class PartnerViewResponse(BaseModel):
    user_name: str
    partner_name: Optional[str] = None
    sharing_active: bool
    current_phase: Optional[str] = None
    next_period_estimate: Optional[str] = None
    countdown_days: Optional[int] = None
    uncertainty_days: float = 2.5
    partner_care_tip: str
    permissions_shared: Dict[str, bool]
    updated_at: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)
