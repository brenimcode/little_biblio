from src.database import engine, Base
from src.models.models import Livro, Membro, Emprestimo

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")
