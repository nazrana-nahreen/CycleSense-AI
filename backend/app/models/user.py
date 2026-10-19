import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    preferred_language = Column(String(10), default="en", nullable=False)
    privacy_mode = Column(Boolean, default=False, nullable=False)
    cycle_length_days = Column(Integer, default=28, nullable=False)
    period_duration_days = Column(Integer, default=5, nullable=False)
    reminder_enabled = Column(Boolean, default=True, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    partner_sharing_enabled = Column(Boolean, default=False, nullable=False)
    partner_name = Column(String(255), nullable=True)
    partner_email = Column(String(255), nullable=True)
    partner_code = Column(String(50), nullable=True, index=True)
    partner_permissions_json = Column(String(500), nullable=True)
    partner_status = Column(String(50), default="inactive", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False
    )

    # Cascading deletions: deleting a user completely purges all sensitive health data
    period_cycles = relationship(
        "PeriodCycle",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
    symptoms = relationship(
        "DailySymptom",
        back_populates="user",
        cascade="all, delete-orphan",
        passive_deletes=True
    )
