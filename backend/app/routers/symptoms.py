from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.symptom import DailySymptom
from app.schemas.symptom import SymptomCreate, SymptomUpdate, SymptomResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/symptoms", tags=["Daily Symptoms"])


@router.get(
    "",
    response_model=List[SymptomResponse],
    summary="List daily symptom entries for authenticated user"
)
def list_symptoms(
    date: Optional[str] = Query(None, pattern=r"^\d{4}-\d{2}-\d{2}$"),
    limit: int = Query(50, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(DailySymptom).filter(DailySymptom.user_id == current_user.id)
    if date:
        query = query.filter(DailySymptom.date == date)
    
    symptoms = query.order_by(DailySymptom.date.desc()).limit(limit).all()
    return symptoms


@router.post(
    "",
    response_model=SymptomResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record or update daily symptom log (Upsert by date)"
)
def create_or_update_symptom(
    data: SymptomCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if entry for user and date already exists (upsert pattern)
    existing = (
        db.query(DailySymptom)
        .filter(DailySymptom.user_id == current_user.id, DailySymptom.date == data.date)
        .first()
    )

    if existing:
        for field, value in data.model_dump().items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    new_symptom = DailySymptom(
        user_id=current_user.id,
        date=data.date,
        cramps_severity=data.cramps_severity,
        bleeding_flow=data.bleeding_flow,
        mood=data.mood,
        acne=data.acne,
        bloating=data.bloating,
        fatigue=data.fatigue,
        headache=data.headache,
        sleep_quality=data.sleep_quality,
        notes=data.notes,
    )
    db.add(new_symptom)
    db.commit()
    db.refresh(new_symptom)
    return new_symptom


@router.put(
    "/{symptom_id}",
    response_model=SymptomResponse,
    summary="Update a symptom entry by ID"
)
def update_symptom(
    symptom_id: int,
    data: SymptomUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enforce IDOR protection
    symptom = (
        db.query(DailySymptom)
        .filter(DailySymptom.id == symptom_id, DailySymptom.user_id == current_user.id)
        .first()
    )
    if not symptom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom entry not found."
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(symptom, field, value)

    db.commit()
    db.refresh(symptom)
    return symptom


@router.delete(
    "/{symptom_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a symptom entry by ID"
)
def delete_symptom(
    symptom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enforce IDOR protection
    symptom = (
        db.query(DailySymptom)
        .filter(DailySymptom.id == symptom_id, DailySymptom.user_id == current_user.id)
        .first()
    )
    if not symptom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom entry not found."
        )

    db.delete(symptom)
    db.commit()
    return {"message": "Symptom entry deleted successfully."}
