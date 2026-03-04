import { useEffect, useState } from "react";
import { Book } from "@/types";

const API_URL = "http://localhost:8080/livros";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar livros");
        return res.json();
      })
      .then(setBooks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addBook = async (book: Omit<Book, "id" | "createdAt">) => {
    setLoading(true);
    setError(null);
    try {
      // Monta o payload conforme LivroCreate
      const payload: any = {
        isbn: book.isbn,
        titulo: book.titulo,
        autor: book.autor,
        status: book.status ?? "DISPONIVEL"
      };
      if (book.capa_url) {
        payload.capa_url = book.capa_url;
      }
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar livro");
      const newBook = await res.json();
      setBooks((prev) => [...prev, newBook]);
      return newBook;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: number, data: Partial<Book>) => {
    setLoading(true);
    setError(null);
    try {
      // Monta o payload conforme LivroUpdate
      const payload = {
        isbn: data.isbn,
        titulo: data.titulo,
        autor: data.autor,
        capa_url: data.capa_url ?? null,
        status: data.status ?? "DISPONIVEL"
      };
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao atualizar livro");
      const updated = await res.json();
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
      return updated;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Erro ao deletar livro");
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { books, addBook, updateBook, deleteBook, loading, error };
}
