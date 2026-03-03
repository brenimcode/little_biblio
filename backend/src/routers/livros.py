from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.schemas.schemas import LivroCreate, LivroUpdate, LivroOut, StatusEnum
from src.services.services import criar_livro, listar_livros, atualizar_livro
from typing import List, Optional

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/livros", tags=["livros"])

@router.post("/", response_model=LivroOut)
def post_livro(livro: LivroCreate, db: Session = Depends(get_db)):
    return criar_livro(db, livro)

@router.get("/", response_model=List[LivroOut])
def get_livros(
    titulo: Optional[str] = Query(None),
    autor: Optional[str] = Query(None),
    isbn: Optional[str] = Query(None),
    status: Optional[StatusEnum] = Query(None),
    db: Session = Depends(get_db)
):
    return listar_livros(db, titulo, autor, isbn, status)

@router.put("/{id}", response_model=LivroOut)
def put_livro(id: int, livro: LivroUpdate, db: Session = Depends(get_db)):
    return atualizar_livro(db, id, livro)
