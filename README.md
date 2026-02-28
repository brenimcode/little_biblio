# 📚 Little Biblio

> Sistema simplificado para gestão de coleções físicas de livros.

## 🛠 Stack Tecnológica

* **Front-End:** ReactJS (Interface reativa e intuitiva)
* **Back-End:** Python com FastAPI (Performance e tipagem rápida)
* **Banco de Dados:** PostgreSQL (Persistência relacional robusta)

## 📂 Estrutura do Repositório

* `/src/backend`: API REST, modelos do banco e lógica de negócio.
* `/src/frontend`: Componentes de UI e integração com a API.
* `/docs`: Documentação técnica e requisitos.
* `diagram-classes.md`: Representação visual da arquitetura do sistema.

## 🏗 Modelo de Classes (Projeto)

Abaixo está a estrutura planejada para suportar as Histórias de Usuário (HUs):

```mermaid
classDiagram
    class Livro {
        +UUID id
        +String titulo
        +String autor
        +String isbn
        +String status
        +editarDados()
    }
    class Membro {
        +UUID id
        +String nome
        +String email
        +String telefone
        +cadastrar()
    }
    class Emprestimo {
        +UUID id
        +DateTime dataEmprestimo
        +DateTime dataDevolucao
        +registrarEmprestimo(livroId, membroId)
        +finalizarDevolucao()
    }
    class Biblioteca {
        +List livros
        +List membros
        +adicionarLivro(Livro)
        +buscarLivro(termo)
        +gerarRelatorioEmprestados()
    }

    Livro "1" -- "0..1" Emprestimo
    Membro "1" -- "0..*" Emprestimo
    Biblioteca "1" -- "*" Livro
    Biblioteca "1" -- "*" Membro

```

## 📋 Rastreabilidade de Requisitos

| HU | Descrição | Método Principal (Implementação) |
| --- | --- | --- |
| **HU01** | Adicionar Livro | `Biblioteca.adicionarLivro()` |
| **HU03** | Registrar Empréstimo | `Emprestimo.registrarEmprestimo()` |
| **HU05** | Buscar Livros | `Biblioteca.buscarLivro()` |
| **HU06** | Listar Emprestados | `Biblioteca.gerarRelatorioEmprestados()` |

---
