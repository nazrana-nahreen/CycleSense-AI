import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.period import PeriodCycle
from app.schemas.period import (
    PeriodCreate,
    PeriodUpdate,
    PeriodResponse,
    CycleStatsResponse,
    CyclePredictionResponse,
)
from app.services.cycle_analytics import calculate_cycle_stats, calculate_cycle_prediction
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/cycles", tags=["Period & Cycle Records"])


def _recompute_cycle_lengths(cycles: List[PeriodCycle]):
    """Helper to recalculate cycle_length between consecutive cycle onsets."""
    sorted_cycles = sorted(cycles, key=lambda c: c.start_date)
    for i, c in enumerate(sorted_cycles):
        if i == 0:
            c.cycle_length = None
        else:
            prev_start = datetime.date.fromisoformat(sorted_cycles[i - 1].start_date)
            curr_start = datetime.date.fromisoformat(c.start_date)
            diff = (curr_start - prev_start).days
            c.cycle_length = diff if diff > 0 else None


@router.get(
    "",
    response_model=List[PeriodResponse],
    summary="List all recorded period cycles for authenticated user"
)
def list_cycles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cycles = (
        db.query(PeriodCycle)
        .filter(PeriodCycle.user_id == current_user.id)
        .order_by(PeriodCycle.start_date.desc())
        .all()
    )
    return cycles


@router.post(
    "",
    response_model=PeriodResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record a new period cycle"
)
def create_cycle(
    data: PeriodCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start = datetime.date.fromisoformat(data.start_date)
    end = datetime.date.fromisoformat(data.end_date)
    period_length = (end - start).days + 1

    new_cycle = PeriodCycle(
        user_id=current_user.id,
        start_date=data.start_date,
        end_date=data.end_date,
        period_length=period_length,
        bleeding_intensity=data.bleeding_intensity,
        notes=data.notes,
    )
    db.add(new_cycle)
    db.commit()
    db.refresh(new_cycle)

    # Recompute cycle lengths for user's cycles
    all_user_cycles = db.query(PeriodCycle).filter(PeriodCycle.user_id == current_user.id).all()
    _recompute_cycle_lengths(all_user_cycles)
    db.commit()
    db.refresh(new_cycle)

    return new_cycle


@router.put(
    "/{cycle_id}",
    response_model=PeriodResponse,
    summary="Update an existing period record"
)
def update_cycle(
    cycle_id: int,
    data: PeriodUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enforce IDOR protection: only allow updating cycles belonging to current_user
    cycle = (
        db.query(PeriodCycle)
        .filter(PeriodCycle.id == cycle_id, PeriodCycle.user_id == current_user.id)
        .first()
    )
    if not cycle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Period record not found."
        )

    if data.start_date is not None:
        cycle.start_date = data.start_date
    if data.end_date is not None:
        cycle.end_date = data.end_date
    if data.bleeding_intensity is not None:
        cycle.bleeding_intensity = data.bleeding_intensity
    if data.notes is not None:
        cycle.notes = data.notes

    # Re-validate date order
    start = datetime.date.fromisoformat(cycle.start_date)
    end = datetime.date.fromisoformat(cycle.end_date)
    if end < start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot precede start date."
        )
    cycle.period_length = (end - start).days + 1

    all_user_cycles = db.query(PeriodCycle).filter(PeriodCycle.user_id == current_user.id).all()
    _recompute_cycle_lengths(all_user_cycles)
    db.commit()
    db.refresh(cycle)
    return cycle


@router.delete(
    "/{cycle_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete a period record"
)
def delete_cycle(
    cycle_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Enforce IDOR protection
    cycle = (
        db.query(PeriodCycle)
        .filter(PeriodCycle.id == cycle_id, PeriodCycle.user_id == current_user.id)
        .first()
    )
    if not cycle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Period record not found."
        )

    db.delete(cycle)
    db.commit()

    all_user_cycles = db.query(PeriodCycle).filter(PeriodCycle.user_id == current_user.id).all()
    _recompute_cycle_lengths(all_user_cycles)
    db.commit()

    return {"message": "Period cycle deleted successfully."}


@router.get(
    "/stats",
    response_model=CycleStatsResponse,
    summary="Get calculated cycle statistics for authenticated user"
)
def get_cycle_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cycles = db.query(PeriodCycle).filter(PeriodCycle.user_id == current_user.id).all()
    return calculate_cycle_stats(cycles)


@router.get(
    "/prediction",
    response_model=CyclePredictionResponse,
    summary="Get upcoming period estimation and current cycle phase"
)
def get_cycle_prediction(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cycles = db.query(PeriodCycle).filter(PeriodCycle.user_id == current_user.id).all()
    return calculate_cycle_prediction(
        cycles,
        fallback_cycle_length=current_user.cycle_length_days,
        fallback_period_duration=current_user.period_duration_days
    )
