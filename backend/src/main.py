from fastapi import FastAPI
from src.routers import livros, membros, emprestimos
from src.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware

description = """
BackEnd API para o projeto Little Biblio, desenvolvido como parte da disciplina de Engenharia De Software. Esta API foi construída utilizando o framework FastAPI e tem como objetivo fornecer funcionalidades para gerenciamento de livros, membros e empréstimos em uma biblioteca.
"""

app = FastAPI(
    description=description,
    title="Little Biblio API",
    version="1.0",
    swagger_ui_parameters={
        "syntaxHighlight.theme": "monokai",
        "layout": "BaseLayout",
        "filter": True,
        "tryItOutEnabled": True,
        "onComplete": "Ok"
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(livros.router)
app.include_router(membros.router)
app.include_router(emprestimos.router)


