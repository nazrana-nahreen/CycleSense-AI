import json
import secrets
import datetime
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.period import PeriodCycle
from app.models.symptom import DailySymptom
from app.schemas.user import (
    UserResponse,
    UserUpdate,
    PasswordChange,
    AvatarUploadRequest,
    PartnerInviteRequest,
    PartnerViewResponse,
)
from app.schemas.period import PeriodResponse
from app.schemas.symptom import SymptomResponse
from app.services.auth_service import verify_password, hash_password
from app.services.cycle_analytics import calculate_cycle_stats, calculate_cycle_prediction
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users & Privacy"])


@router.get(
    "/profile",
    response_model=UserResponse,
    summary="Get user profile and health settings"
)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put(
    "/profile",
    response_model=UserResponse,
    summary="Update user settings and preferences"
)
def update_profile(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post(
    "/avatar",
    response_model=UserResponse,
    summary="Upload and update user profile avatar"
)
def upload_avatar(
    data: AvatarUploadRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Saves the profile picture avatar (data URL or image link) to user profile.
    """
    current_user.avatar_url = data.avatar_url
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post(
    "/partner/invite",
    response_model=UserResponse,
    summary="Configure partner sharing and generate secure invite code"
)
def configure_partner_sharing(
    data: PartnerInviteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Enables partner sharing, generates or retains a unique 6-character partner code,
    and saves customizable sharing permissions.
    """
    current_user.partner_sharing_enabled = True
    if not current_user.partner_code:
        random_suffix = secrets.token_hex(2).upper()
        current_user.partner_code = f"CYCLE-{random_suffix}"
    
    if data.partner_name:
        current_user.partner_name = data.partner_name.strip()
    if data.partner_email:
        current_user.partner_email = str(data.partner_email).lower().strip()
    
    default_perms = {
        "sharePeriodDates": True,
        "shareCyclePhase": True,
        "shareMoodAndSymptoms": False,
        "shareDailyTips": True,
    }
    if data.permissions:
        default_perms.update(data.permissions)
    
    current_user.partner_permissions_json = json.dumps(default_perms)
    current_user.partner_status = "connected" if data.partner_name else "pending"

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post(
    "/partner/revoke",
    response_model=UserResponse,
    summary="Revoke partner cycle sharing access immediately"
)
def revoke_partner_sharing(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Instantly disables partner sharing and revokes partner code access for privacy and safety.
    """
    current_user.partner_sharing_enabled = False
    current_user.partner_status = "inactive"
    current_user.partner_code = None
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get(
    "/partner/shared/{partner_code}",
    response_model=PartnerViewResponse,
    summary="Public read-only partner dashboard view based on permitted settings"
)
def get_shared_partner_view(
    partner_code: str,
    db: Session = Depends(get_db)
):
    """
    Returns the read-only cycle companion view for the partner.
    Only exposes information explicitly granted under user's permissions.
    """
    user = (
        db.query(User)
        .filter(
            User.partner_code == partner_code.strip().upper(),
            User.partner_sharing_enabled == True,
            User.is_active == True
        )
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shared partner access code is invalid, expired, or revoked."
        )

    # Parse permissions
    perms = {
        "sharePeriodDates": True,
        "shareCyclePhase": True,
        "shareMoodAndSymptoms": False,
        "shareDailyTips": True,
    }
    if user.partner_permissions_json:
        try:
            perms.update(json.loads(user.partner_permissions_json))
        except Exception:
            pass

    # Retrieve user cycle prediction
    cycles = db.query(PeriodCycle).filter(PeriodCycle.user_id == user.id).all()
    prediction = calculate_cycle_prediction(
        cycles,
        fallback_cycle_length=user.cycle_length_days,
        fallback_period_duration=user.period_duration_days
    )

    # Calculate countdown
    countdown = None
    if perms.get("sharePeriodDates") and prediction.get("predicted_start_date"):
        try:
            target_date = datetime.date.fromisoformat(prediction["predicted_start_date"])
            today = datetime.date.today()
            countdown = (target_date - today).days
        except Exception:
            pass

    # Supportive Care Tip for Partner
    phase = prediction.get("current_phase", "follicular")
    if phase == "menstrual":
        tip = f"{user.name} is currently experiencing her menstrual bleeding. Warm beverages, extra rest, heating pads, and mindful kindness are deeply appreciated right now."
    elif phase == "follicular":
        tip = f"{user.name}'s estrogen levels are rising. Energy, optimism, and creativity are high—a great time to plan active outings, dinners, or new adventures together!"
    elif phase == "ovulation":
        tip = f"{user.name} is in her peak ovulation window. Confidence, social energy, and connection are at their highest."
    else:  # luteal
        tip = f"{user.name} is in her luteal phase. Progesterone is dominant, which can bring fatigue or mild mood shifts. Offering patience, comfortable spaces, and favorite snacks goes a long way."

    return PartnerViewResponse(
        user_name=user.name,
        partner_name=user.partner_name,
        sharing_active=True,
        current_phase=phase if perms.get("shareCyclePhase") else None,
        next_period_estimate=prediction.get("predicted_start_date") if perms.get("sharePeriodDates") else None,
        countdown_days=countdown,
        uncertainty_days=prediction.get("uncertainty_days", 2.5),
        partner_care_tip=tip if perms.get("shareDailyTips") else "Support your partner with empathy, patience, and love.",
        permissions_shared=perms,
        updated_at=datetime.datetime.utcnow().isoformat()
    )


@router.post(
    "/change-password",
    summary="Change user password"
)
def change_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password does not match."
        )

    current_user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password updated successfully."}


@router.get(
    "/export",
    summary="Export all sensitive user data as JSON (GDPR / Data Portability)"
)
def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    cycles = db.query(PeriodCycle).filter(PeriodCycle.user_id == current_user.id).order_by(PeriodCycle.start_date.desc()).all()
    symptoms = db.query(DailySymptom).filter(DailySymptom.user_id == current_user.id).order_by(DailySymptom.date.desc()).all()

    return {
        "metadata": {
            "app": "CycleSense AI",
            "version": "1.0.0",
            "exported_at": datetime.datetime.utcnow().isoformat(),
            "user_id": current_user.id,
        },
        "user_profile": UserResponse.model_validate(current_user).model_dump(),
        "period_cycles": [PeriodResponse.model_validate(c).model_dump() for c in cycles],
        "symptoms": [SymptomResponse.model_validate(s).model_dump() for s in symptoms],
    }


@router.delete(
    "/account",
    status_code=status.HTTP_200_OK,
    summary="Permanently delete user account and all health records"
)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Explicitly delete all sensitive child health records first
    db.query(PeriodCycle).filter(PeriodCycle.user_id == current_user.id).delete()
    db.query(DailySymptom).filter(DailySymptom.user_id == current_user.id).delete()
    db.delete(current_user)
    db.commit()
    return {"message": "User account and all associated health records have been permanently erased."}
