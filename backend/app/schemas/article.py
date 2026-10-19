from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ArticleSource(BaseModel):
    title: str
    url: str


class ArticleResponse(BaseModel):
    id: str
    title: str
    title_bn: str
    summary: str
    summary_bn: str
    category: str
    read_time: str
    verified: bool
    reviewer: str
    content: str
    content_bn: str
    symptoms: List[str] = []
    when_to_consult: List[str] = []
    sources: List[ArticleSource] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ArticleListItem(BaseModel):
    id: str
    title: str
    title_bn: str
    summary: str
    summary_bn: str
    category: str
    read_time: str
    verified: bool
    reviewer: str
