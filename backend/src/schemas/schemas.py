from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
import enum

class StatusEnum(str, enum.Enum):
    DISPONIVEL = "DISPONIVEL"
    EMPRESTADO = "EMPRESTADO"

class LivroBase(BaseModel):
    isbn: str
    titulo: str
    autor: str
    capa_url: Optional[str] = None
    status: StatusEnum = StatusEnum.DISPONIVEL

class LivroCreate(LivroBase):
    pass

class LivroUpdate(LivroBase):
    pass

class LivroOut(LivroBase):
    id: int
    class Config:
        from_attributes = True

class MembroBase(BaseModel):
    nome: str
    email: EmailStr
    telefone: str

class MembroCreate(MembroBase):
    pass

class MembroOut(MembroBase):
    id: int
    class Config:
        from_attributes = True

class EmprestimoBase(BaseModel):
    livro_id: int
    membro_id: int
    data_emprestimo: datetime
    data_devolucao_prevista: datetime
    data_devolucao_real: Optional[datetime] = None

class EmprestimoCreate(BaseModel):
    livro_id: int
    membro_id: int
    data_devolucao_prevista: datetime

class EmprestimoOut(EmprestimoBase):
    id: int
    class Config:
        from_attributes = True

class RelatorioEmprestimo(BaseModel):
    id: int
    titulo: str
    livro_id: int
    nome_membro: str
    telefone: str
    data_emprestimo: datetime
