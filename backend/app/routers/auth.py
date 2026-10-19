from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, TokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user"
)
def register(data: UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new user account with secure bcrypt password hashing.
    Enforces privacy consent for sensitive health records.
    """
    normalized_email = data.email.lower().strip()
    
    # Check for existing account
    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Hash password safely
    hashed_pwd = hash_password(data.password)

    new_user = User(
        name=data.name.strip(),
        email=normalized_email,
        hashed_password=hashed_pwd,
        preferred_language=data.preferred_language,
        privacy_mode=False,
        cycle_length_days=28,
        period_duration_days=5,
        reminder_enabled=True,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate token
    token = create_access_token({"sub": str(new_user.id)})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user).model_dump()
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate user and return JWT access token"
)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates user with email and password, returning a JWT token.
    """
    normalized_email = data.email.lower().strip()
    user = db.query(User).filter(User.email == normalized_email).first()
    
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated."
        )

    token = create_access_token({"sub": str(user.id)})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user).model_dump()
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current authenticated user profile"
)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the currently authenticated user's profile."""
    return current_user
