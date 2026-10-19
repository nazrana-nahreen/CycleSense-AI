from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: Optional[str] = None
    preferred_language: Literal["en", "bn"] = "en"
    consent: bool = Field(..., description="Consent for handling sensitive health information")

    @field_validator("consent")
    @classmethod
    def validate_consent(cls, v: bool) -> bool:
        if not v:
            raise ValueError("Consent for handling health information is required.")
        return v

    @field_validator("confirm_password")
    @classmethod
    def validate_password_match(cls, v: Optional[str], info) -> Optional[str]:
        if v is not None and "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match.")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class TokenPayload(BaseModel):
    sub: str
    exp: int
