import { useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { BookFormModal } from "@/components/BookFormModal";
import { LoanModal } from "@/components/LoanModal";
import { ReturnDialog } from "@/components/ReturnDialog";

const statusFilters = ["all", "available", "borrowed"] as const;
const statusLabels = { all: "Todos", available: "Disponíveis", borrowed: "Emprestados" };

const BooksPage = () => {
  const { books, deleteBook, activeLoans, members } = useLibrary();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>("all");
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [loanBook, setLoanBook] = useState<Book | null>(null);
  const [returnBook, setReturnBook] = useState<Book | null>(null);

  const showAddModal = searchParams.get("action") === "add";

  const filtered = books.filter((b) => {
    const matchesSearch =
      b.titulo.toLowerCase().includes(search.toLowerCase()) ||
      b.autor.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getLoanInfo = (bookId: string) => {
    const loan = activeLoans.find((l) => l.bookId === bookId);
    if (!loan) return null;
    const member = members.find((m) => m.id === loan.memberId);
    return { loan, member };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Catálogo de Livros</h1>
        <Button size="sm" onClick={() => setSearchParams({ action: "add" })}>
          <Plus className="h-4 w-4" /> Adicionar Livro
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, autor ou ISBN..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {statusFilters.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              onClick={() => setStatusFilter(s)}
            >
              {statusLabels[s]}
            </Button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum livro encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((book) => {
            const loanInfo = getLoanInfo(book.id);
            return (
              <Card key={book.id} className="overflow-hidden">
                <div className="flex h-32 items-center justify-center bg-secondary">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-semibold">{book.title}</h3>
                    <Badge variant={book.status === "available" ? "default" : "secondary"} className="shrink-0 text-xs">
                      {book.status === "available" ? "Disponível" : "Emprestado"}
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{book.author}</p>
                  {loanInfo && (
                    <p className="mb-3 text-xs text-muted-foreground">
                      Com: <span className="font-medium text-foreground">{loanInfo.member?.name}</span>
                    </p>
                  )}
                  <div className="flex gap-2">
                    {book.status === "available" ? (
                      <Button size="sm" className="flex-1" onClick={() => setLoanBook(book)}>
                        Emprestar
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" className="flex-1" onClick={() => setReturnBook(book)}>
                        Devolver
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => setEditBook(book)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteBook(book.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <BookFormModal
        open={showAddModal}
        onClose={() => setSearchParams({})}
      />
      <BookFormModal
        open={!!editBook}
        book={editBook ?? undefined}
        onClose={() => setEditBook(null)}
      />
      <LoanModal
        open={!!loanBook}
        book={loanBook ?? undefined}
        onClose={() => setLoanBook(null)}
      />
      <ReturnDialog
        open={!!returnBook}
        book={returnBook ?? undefined}
        onClose={() => setReturnBook(null)}
      />
    </div>
  );
};

export default BooksPage;
