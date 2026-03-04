from sqlalchemy.orm import Session
from src.models.models import Livro, StatusEnum, Membro, Emprestimo
from src.schemas.schemas import LivroCreate, LivroUpdate, MembroCreate, EmprestimoCreate
from datetime import datetime, timezone
from fastapi import HTTPException

# Livro Services
def criar_livro(db: Session, livro: LivroCreate):
    db_livro = Livro(**livro.dict())
    db.add(db_livro)
    db.commit()
    db.refresh(db_livro)
    return db_livro

def listar_livros(db: Session, titulo=None, autor=None, isbn=None, status=None):
    query = db.query(Livro)
    if titulo:
        query = query.filter(Livro.titulo.ilike(f"%{titulo}%"))
    if autor:
        query = query.filter(Livro.autor.ilike(f"%{autor}%"))
    if isbn:
        query = query.filter(Livro.isbn.ilike(f"%{isbn}%"))
    if status:
        query = query.filter(Livro.status == status)
    return query.all()

def atualizar_livro(db: Session, livro_id: int, livro: LivroUpdate):
    db_livro = db.query(Livro).filter(Livro.id == livro_id).first()
    if not db_livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    for key, value in livro.dict().items():
        setattr(db_livro, key, value)
    db.commit()
    db.refresh(db_livro)
    return db_livro

# Membro Services
def criar_membro(db: Session, membro: MembroCreate):
    db_membro = Membro(**membro.dict())
    db.add(db_membro)
    db.commit()
    db.refresh(db_membro)
    return db_membro

def listar_membros(db: Session):
    return db.query(Membro).all()

# Livro Services
def deletar_livro(db: Session, livro_id: int):
    # 1. Busca o livro pelo ID
    db_livro = db.query(Livro).filter(Livro.id == livro_id).first()
    
    # 2. Erro 404 se o livro não existir
    if not db_livro:
        raise HTTPException(status_code=404, detail="Livro não encontrado")
    
    # 3. Regra de Negócio: Não deletar se estiver emprestado
    # Verificamos tanto o campo 'status' quanto a existência de empréstimos em aberto
    if db_livro.status == StatusEnum.EMPRESTADO:
        raise HTTPException(
            status_code=400, 
            detail="Não é possível remover um livro que está atualmente emprestado."
        )

    # 4. Executa a remoção
    db.delete(db_livro)
    db.commit()
    return None

# Membro Services
def deletar_membro(db: Session, membro_id: int):
    # 1. Busca o membro no banco
    db_membro = db.query(Membro).filter(Membro.id == membro_id).first()
    
    # 2. Se não existir, levanta erro 404
    if not db_membro:
        raise HTTPException(status_code=404, detail="Membro não encontrado")
    
    # 3. Verificação de integridade (Opcional para MVP, mas recomendada):
    # Verifica se o membro possui empréstimos ativos antes de deletar
    emprestimo_ativo = db.query(Emprestimo).filter(
        Emprestimo.membro_id == membro_id, 
        Emprestimo.data_devolucao_real == None
    ).first()
    
    if emprestimo_ativo:
        raise HTTPException(
            status_code=400, 
            detail="Não é possível deletar um membro com empréstimo pendente."
        )

    # 4. Deleta e commita
    db.delete(db_membro)
    db.commit()
    return None # Retorno comum para status 204

# Emprestimo Services ...
def registrar_emprestimo(db: Session, emprestimo: EmprestimoCreate):
    livro = db.query(Livro).filter(Livro.id == emprestimo.livro_id).first()
    if not livro or livro.status != StatusEnum.DISPONIVEL:
        raise HTTPException(status_code=400, detail="Livro não disponível para empréstimo")
    membro = db.query(Membro).filter(Membro.id == emprestimo.membro_id).first()
    if not membro:
        raise HTTPException(status_code=404, detail="Membro não encontrado")
    novo_emprestimo = Emprestimo(
        livro_id=emprestimo.livro_id,
        membro_id=emprestimo.membro_id,
        data_emprestimo=datetime.now(timezone.utc),
        data_devolucao_prevista=emprestimo.data_devolucao_prevista
    )
    livro.status = StatusEnum.EMPRESTADO
    db.add(novo_emprestimo)
    db.commit()
    db.refresh(novo_emprestimo)
    return novo_emprestimo

def finalizar_devolucao(db: Session, emprestimo_id: int):
    emprestimo = db.query(Emprestimo).filter(Emprestimo.id == emprestimo_id).first()
    if not emprestimo or emprestimo.data_devolucao_real:
        raise HTTPException(status_code=404, detail="Empréstimo não encontrado ou já devolvido")
    emprestimo.data_devolucao_real = datetime.now(timezone.utc)
    livro = db.query(Livro).filter(Livro.id == emprestimo.livro_id).first()
    livro.status = StatusEnum.DISPONIVEL
    db.commit()
    db.refresh(emprestimo)
    return emprestimo

def relatorio_emprestimos(db: Session):
    from src.schemas.schemas import RelatorioEmprestimo
    query = db.query(Emprestimo, Livro, Membro).join(Livro, Emprestimo.livro_id == Livro.id).join(Membro, Emprestimo.membro_id == Membro.id)
    query = query.filter(Emprestimo.data_devolucao_real == None)
    result = []
    for emp, livro, membro in query.all():
        result.append(RelatorioEmprestimo(
            id=emp.id,
            titulo=livro.titulo,
            nome_membro=membro.nome,
            livro_id=livro.id,
            telefone=membro.telefone,
            data_emprestimo=emp.data_emprestimo
        ))
    return result
