# Little Biblio - Backend

## Pré-requisitos
- Docker e Docker Compose instalados
- Python 3.10+ instalado

## Passo a Passo para rodar o backend

1. **Suba o banco de dados PostgreSQL com Docker Compose:**
   ```bash
   docker compose up -d
   ```
   Isso irá criar um container PostgreSQL acessível em `localhost:5436`.

2. **Crie e ative o ambiente virtual Python:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

   OU `python3`

3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure a variável de ambiente DATABASE_URL:**
   Crie um arquivo `.env` na pasta `backend/` com o conteúdo:
   ```env
   DATABASE_URL=postgresql://littlebiblio:littlebiblio123@localhost:5436/littlebiblio_db
   ```

5. **Inicie a API FastAPI:**
   ```bash
   python start.py
   ```
   A API estará disponível em `http://localhost:8080`.

   Acesse a Documentação interativa em `http://localhost:8080/docs` para testar os endpoints.

---

## Como rodar os testes

1. Certifique-se de estar com o ambiente virtual ativado e dependências instaladas.
2. Execute os testes unitários com:
   ```bash
   python -m unittest discover -s tests
   ```

Se quiser testar a API, o backend deve estar rodando.

## Dependências para testes
- fastapi
- sqlalchemy
- python-dotenv
- psycopg2-binary
- uvicorn
- fastapi[test] (inclui TestClient)

Se necessário, adicione ao requirements.txt:

```
fastapi[test]
```
