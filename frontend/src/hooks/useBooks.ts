import { useLocalStorage } from "./useLocalStorage";
import { Book } from "@/types";

const SEED_BOOKS: Book[] = [
  { id: "b1", title: "Dom Casmurro", author: "Machado de Assis", isbn: "978-8535910681", coverUrl: "", status: "available", createdAt: "2024-01-10" },
  { id: "b2", title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", isbn: "978-8595081512", coverUrl: "", status: "borrowed", createdAt: "2024-01-12" },
  { id: "b3", title: "1984", author: "George Orwell", isbn: "978-8535914849", coverUrl: "", status: "available", createdAt: "2024-02-01" },
  { id: "b4", title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-8525432186", coverUrl: "", status: "available", createdAt: "2024-02-15" },
  { id: "b5", title: "A Revolução dos Bichos", author: "George Orwell", isbn: "978-8535909555", coverUrl: "", status: "borrowed", createdAt: "2024-03-01" },
];

export function useBooks() {
  const [books, setBooks] = useLocalStorage<Book[]>("littlebiblio_books", SEED_BOOKS);

  const addBook = (book: Omit<Book, "id" | "createdAt" | "status">) => {
    const newBook: Book = {
      ...book,
      id: crypto.randomUUID(),
      status: "available",
      createdAt: new Date().toISOString(),
    };
    setBooks((prev) => [...prev, newBook]);
    return newBook;
  };

  const updateBook = (id: string, data: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return { books, addBook, updateBook, deleteBook };
}
