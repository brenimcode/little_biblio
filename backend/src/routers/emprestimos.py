from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import SessionLocal
from src.schemas.schemas import EmprestimoCreate, EmprestimoOut, RelatorioEmprestimo
from src.services.services import registrar_emprestimo, finalizar_devolucao, relatorio_emprestimos
from typing import List

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/emprestimos", tags=["emprestimos"])

@router.post("/", response_model=EmprestimoOut)
def post_emprestimo(emprestimo: EmprestimoCreate, db: Session = Depends(get_db)):
    return registrar_emprestimo(db, emprestimo)

@router.patch("/{id}/devolucao", response_model=EmprestimoOut)
def patch_devolucao(id: int, db: Session = Depends(get_db)):
    return finalizar_devolucao(db, id)

@router.get("/relatorio", response_model=List[RelatorioEmprestimo])
def get_relatorio(db: Session = Depends(get_db)):
    return relatorio_emprestimos(db)
