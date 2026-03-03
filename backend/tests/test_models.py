import unittest
from src.models.models import Livro, StatusEnum, Membro, Emprestimo
from datetime import datetime, timezone

class TestLivro(unittest.TestCase):
    def test_livro_criacao(self):
        livro = Livro(isbn="123", titulo="Teste", autor="Autor", capa_url="url", status=StatusEnum.DISPONIVEL)
        self.assertEqual(livro.titulo, "Teste")
        self.assertEqual(livro.status, StatusEnum.DISPONIVEL)

class TestMembro(unittest.TestCase):
    def test_membro_criacao(self):
        membro = Membro(nome="João", email="joao@email.com", telefone="123456789")
        self.assertEqual(membro.nome, "João")
        self.assertEqual(membro.email, "joao@email.com")

class TestEmprestimo(unittest.TestCase):
    def test_emprestimo_criacao(self):
        emp = Emprestimo(livro_id=1, membro_id=1, data_emprestimo=datetime.now(timezone.utc), data_devolucao_prevista=datetime.now(timezone.utc))
        self.assertEqual(emp.livro_id, 1)
        self.assertIsNone(emp.data_devolucao_real)

if __name__ == "__main__":
    unittest.main()
