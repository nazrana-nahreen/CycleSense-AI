import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class PeriodCycle(Base):
    __tablename__ = "period_cycles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    start_date = Column(String(10), nullable=False, index=True)  # YYYY-MM-DD
    end_date = Column(String(10), nullable=False)                # YYYY-MM-DD
    period_length = Column(Integer, nullable=False)              # Duration in days
    cycle_length = Column(Integer, nullable=True)                # Days from prior period onset
    bleeding_intensity = Column(String(20), default="medium", nullable=False) # light, medium, heavy
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False
    )

    user = relationship("User", back_populates="period_cycles")

    __table_args__ = (
        Index("idx_user_period_start", "user_id", "start_date"),
    )
