import datetime
from sqlalchemy import Column, String, Text, Boolean, DateTime
from app.database import Base


class EducationalArticle(Base):
    __tablename__ = "educational_articles"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    title_bn = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    summary_bn = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    read_time = Column(String(50), default="5 min", nullable=False)
    verified = Column(Boolean, default=True, nullable=False)
    reviewer = Column(String(255), default="Clinical Health Review Board", nullable=False)
    content = Column(Text, nullable=False)
    content_bn = Column(Text, nullable=False)
    symptoms_json = Column(Text, nullable=True)         # JSON string list
    when_to_consult_json = Column(Text, nullable=True)  # JSON string list
    sources_json = Column(Text, nullable=True)          # JSON string list of {title, url}
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
