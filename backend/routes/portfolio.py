import os
import secrets

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from portfolio.schema import PortfolioData
from portfolio.storage import load_portfolio, save_portfolio

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])
security = HTTPBasic()

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin")


def verify_admin(credentials: HTTPBasicCredentials = Depends(security)) -> None:
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.get("", response_model=PortfolioData)
async def get_portfolio() -> PortfolioData:
    return load_portfolio()


@router.put("", response_model=PortfolioData)
async def update_portfolio(
    data: PortfolioData,
    _: None = Depends(verify_admin),
) -> PortfolioData:
    save_portfolio(data)
    return data
