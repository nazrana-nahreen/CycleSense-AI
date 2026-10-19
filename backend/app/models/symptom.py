import datetime
from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class DailySymptom(Base):
    __tablename__ = "daily_symptoms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    date = Column(String(10), nullable=False, index=True)        # YYYY-MM-DD
    cramps_severity = Column(Integer, default=0, nullable=False) # 0-10 scale
    bleeding_flow = Column(String(20), default="none", nullable=False) # none, light, medium, heavy
    mood = Column(String(20), default="calm", nullable=False)    # calm, happy, anxious, sad, irritable, exhausted
    acne = Column(Boolean, default=False, nullable=False)
    bloating = Column(Boolean, default=False, nullable=False)
    fatigue = Column(Boolean, default=False, nullable=False)
    headache = Column(Boolean, default=False, nullable=False)
    sleep_quality = Column(String(20), default="good", nullable=False) # good, average, poor
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False
    )

    user = relationship("User", back_populates="symptoms")

    __table_args__ = (
        Index("idx_user_symptom_date", "user_id", "date"),
    )
