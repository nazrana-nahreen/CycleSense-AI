import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.article import EducationalArticle
from app.schemas.article import ArticleResponse, ArticleListItem

router = APIRouter(prefix="/api/education/articles", tags=["PCOS & Health Education"])


def _format_article(art: EducationalArticle) -> ArticleResponse:
    return ArticleResponse(
        id=art.id,
        title=art.title,
        title_bn=art.title_bn,
        summary=art.summary,
        summary_bn=art.summary_bn,
        category=art.category,
        read_time=art.read_time,
        verified=art.verified,
        reviewer=art.reviewer,
        content=art.content,
        content_bn=art.content_bn,
        symptoms=json.loads(art.symptoms_json) if art.symptoms_json else [],
        when_to_consult=json.loads(art.when_to_consult_json) if art.when_to_consult_json else [],
        sources=json.loads(art.sources_json) if art.sources_json else [],
        created_at=art.created_at,
    )


@router.get(
    "",
    response_model=List[ArticleResponse],
    summary="List educational articles with category filter and keyword search"
)
def list_articles(
    category: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(EducationalArticle)
    if category and category != "all":
        query = query.filter(EducationalArticle.category == category)
    
    articles = query.all()

    if q:
        query_str = q.lower()
        articles = [
            a for a in articles 
            if query_str in a.title.lower() 
            or query_str in a.title_bn.lower() 
            or query_str in a.summary.lower() 
            or query_str in a.summary_bn.lower()
            or query_str in a.content.lower()
            or query_str in a.content_bn.lower()
            or query_str in a.category.lower()
        ]

    return [_format_article(a) for a in articles]


@router.get(
    "/{article_id}",
    response_model=ArticleResponse,
    summary="Get single educational article by ID"
)
def get_article(article_id: str, db: Session = Depends(get_db)):
    article = db.query(EducationalArticle).filter(EducationalArticle.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Educational article not found."
        )
    return _format_article(article)
