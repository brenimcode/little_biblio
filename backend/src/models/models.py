from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base
import enum

class StatusEnum(enum.Enum):
    DISPONIVEL = "DISPONIVEL"
    EMPRESTADO = "EMPRESTADO"

class Livro(Base):
    __tablename__ = "livros"
    id = Column(Integer, primary_key=True, index=True)
    isbn = Column(String, nullable=False)
    titulo = Column(String, nullable=False)
    autor = Column(String, nullable=False)
    capa_url = Column(String, nullable=True)
    status = Column(Enum(StatusEnum), default=StatusEnum.DISPONIVEL, nullable=False)
    emprestimos = relationship("Emprestimo", back_populates="livro")

class Membro(Base):
    __tablename__ = "membros"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    telefone = Column(String, nullable=False)
    emprestimos = relationship("Emprestimo", back_populates="membro")

class Emprestimo(Base):
    __tablename__ = "emprestimos"
    id = Column(Integer, primary_key=True, index=True)
    livro_id = Column(Integer, ForeignKey("livros.id"), nullable=False)
    membro_id = Column(Integer, ForeignKey("membros.id"), nullable=False)
    data_emprestimo = Column(DateTime, nullable=False)
    data_devolucao_prevista = Column(DateTime, nullable=False)
    data_devolucao_real = Column(DateTime, nullable=True)
    livro = relationship("Livro", back_populates="emprestimos")
    membro = relationship("Membro", back_populates="emprestimos")
