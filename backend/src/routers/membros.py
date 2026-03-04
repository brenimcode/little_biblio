from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.schemas.schemas import MembroCreate, MembroOut
from src.services.services import criar_membro, listar_membros, deletar_membro
from typing import List

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/membros", tags=["membros"])

@router.post("/", response_model=MembroOut)
def post_membro(membro: MembroCreate, db: Session = Depends(get_db)):
    return criar_membro(db, membro)

@router.get("/", response_model=List[MembroOut])
def get_membros(db: Session = Depends(get_db)):
    return listar_membros(db)


@router.delete("/{membro_id}", status_code=204)
def delete_membro(membro_id: int, db: Session = Depends(get_db)):
    return deletar_membro(db, membro_id)
