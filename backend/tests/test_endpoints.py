import unittest
import requests

BASE_URL = "http://localhost:8080"

class TestBackendEndpoints(unittest.TestCase):
    def test_get_livros(self):
        resp = requests.get(f"{BASE_URL}/livros")
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.json(), list)

    def test_get_membros(self):
        resp = requests.get(f"{BASE_URL}/membros")
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.json(), list)

    def test_get_emprestimos_relatorio(self):
        resp = requests.get(f"{BASE_URL}/emprestimos/relatorio")
        self.assertEqual(resp.status_code, 200)
        self.assertIsInstance(resp.json(), list)

if __name__ == "__main__":
    unittest.main()
