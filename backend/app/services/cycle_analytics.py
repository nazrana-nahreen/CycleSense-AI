import math
import datetime
from typing import List, Dict, Any, Optional
from app.models.period import PeriodCycle
from app.models.symptom import DailySymptom


def calculate_cycle_stats(cycles: List[PeriodCycle]) -> Dict[str, Any]:
    """
    Calculates statistical cycle metrics based on recorded period cycles.
    """
    if not cycles:
        return {
            "average_cycle_length": 28.0,
            "average_period_duration": 5.0,
            "cycle_variation": 0.0,
            "total_cycles_recorded": 0,
            "regularity_status": "insufficient_data",
            "min_cycle_length": None,
            "max_cycle_length": None,
        }

    # Sort cycles chronologically by start date
    sorted_cycles = sorted(cycles, key=lambda c: c.start_date)

    lengths: List[int] = []
    durations: List[int] = []

    for i, cycle in enumerate(sorted_cycles):
        durations.append(cycle.period_length)
        if i > 0:
            prev_start = datetime.date.fromisoformat(sorted_cycles[i - 1].start_date)
            curr_start = datetime.date.fromisoformat(cycle.start_date)
            diff = (curr_start - prev_start).days
            if 15 < diff < 60:
                lengths.append(diff)

    avg_length = (
        round(sum(lengths) / len(lengths), 1) if lengths else 28.0
    )
    avg_duration = (
        round(sum(durations) / len(durations), 1) if durations else 5.0
    )

    # Calculate standard deviation variation
    variation = 0.0
    if len(lengths) > 1:
        variance = sum((l - avg_length) ** 2 for l in lengths) / len(lengths)
        variation = round(math.sqrt(variance), 1)

    if len(lengths) < 2:
        regularity_status = "insufficient_data"
    elif variation <= 2.5:
        regularity_status = "regular"
    elif variation <= 5.0:
        regularity_status = "mild_variation"
    else:
        regularity_status = "irregular"

    return {
        "average_cycle_length": avg_length,
        "average_period_duration": avg_duration,
        "cycle_variation": variation,
        "total_cycles_recorded": len(cycles),
        "regularity_status": regularity_status,
        "min_cycle_length": min(lengths) if lengths else None,
        "max_cycle_length": max(lengths) if lengths else None,
    }


def calculate_cycle_prediction(
    cycles: List[PeriodCycle],
    fallback_cycle_length: int = 28,
    fallback_period_duration: int = 5
) -> Dict[str, Any]:
    """
    Calculates estimated next period onset and cycle phase with explicit uncertainty range.
    """
    if not cycles:
        return {
            "predicted_start_date": None,
            "predicted_end_date": None,
            "uncertainty_days": 2.5,
            "cycle_day": None,
            "current_phase": "unknown"
        }

    # Find the most recent cycle start date
    sorted_cycles = sorted(cycles, key=lambda c: c.start_date)
    last_cycle = sorted_cycles[-1]
    last_start = datetime.date.fromisoformat(last_cycle.start_date)
    today = datetime.date.today()

    stats = calculate_cycle_stats(cycles)
    cycle_length = stats["average_cycle_length"] if stats["total_cycles_recorded"] >= 2 else fallback_cycle_length
    period_duration = stats["average_period_duration"] if stats["total_cycles_recorded"] >= 1 else fallback_period_duration
    uncertainty = max(1.5, stats["cycle_variation"] if stats["cycle_variation"] > 0 else 2.5)

    diff_days = (today - last_start).days
    current_cycle_day = diff_days + 1 if diff_days >= 0 else 1

    # Determine estimated cycle phase
    if current_cycle_day <= period_duration:
        phase = "menstrual"
    elif current_cycle_day <= cycle_length - 16:
        phase = "follicular"
    elif current_cycle_day <= cycle_length - 11:
        phase = "ovulation"
    else:
        phase = "luteal"

    next_start = last_start + datetime.timedelta(days=int(round(cycle_length)))
    next_end = next_start + datetime.timedelta(days=int(round(period_duration)) - 1)

    return {
        "predicted_start_date": next_start.isoformat(),
        "predicted_end_date": next_end.isoformat(),
        "uncertainty_days": uncertainty,
        "cycle_day": current_cycle_day,
        "current_phase": phase,
    }


def analyze_notable_patterns(
    cycles: List[PeriodCycle],
    symptoms: List[DailySymptom]
) -> List[str]:
    """
    Produces clinically safe, observation-based patterns based on user's logged data.
    """
    patterns = []
    
    # 1. Cramps frequency
    symptoms_with_cramps = [s for s in symptoms if s.cramps_severity >= 4]
    if len(cycles) >= 3:
        if len(symptoms_with_cramps) >= 2:
            patterns.append(
                f"You reported moderate-to-severe pelvic pain (score ≥ 4) on {len(symptoms_with_cramps)} logged days across recent cycles."
            )
        else:
            patterns.append("Pelvic pain severity has generally remained mild across logged entries.")

    # 2. Flow intensity pattern
    heavy_cycles = [c for c in cycles if c.bleeding_intensity == "heavy"]
    if heavy_cycles:
        patterns.append(
            f"Heavy bleeding recorded in {len(heavy_cycles)} of your last {len(cycles)} logged cycles."
        )

    # 3. Cycle variation
    if len(cycles) >= 3:
        stats = calculate_cycle_stats(cycles)
        if stats["cycle_variation"] <= 2.5:
            patterns.append(
                f"Your cycle duration is relatively steady (average {stats['average_cycle_length']} days, ±{stats['cycle_variation']} days variation)."
            )
        elif stats["cycle_variation"] > 5.0:
            patterns.append(
                f"Your cycle length exhibits noticeable variation (±{stats['cycle_variation']} days). Consider discussing this timeline with your healthcare provider."
            )

    if not patterns:
        patterns.append("Continue logging periods and symptoms to uncover personalized hormonal and cycle patterns.")

    return patterns
