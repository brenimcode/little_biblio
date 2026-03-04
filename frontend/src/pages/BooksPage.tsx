import { useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, BookOpen, Edit, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { BookFormModal } from "@/components/BookFormModal";
import { LoanModal } from "@/components/LoanModal";
import { ReturnDialog } from "@/components/ReturnDialog";

const statusFilters = ["all", "DISPONIVEL", "EMPRESTADO"] as const;
const statusLabels = { all: "Todos", DISPONIVEL: "Disponíveis", EMPRESTADO: "Emprestados" };

const BooksPage = () => {
  const { books, deleteBook, activeLoans, members } = useLibrary();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>("all");
  
  // Estados de controle dos Modais
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [loanBook, setLoanBook] = useState<Book | null>(null);
  const [returnBook, setReturnBook] = useState<Book | null>(null);

  const showAddModal = searchParams.get("action") === "add";

  // Filtro de busca
  const filtered = books.filter((b) => {
    const matchesSearch =
      b.titulo.toLowerCase().includes(search.toLowerCase()) ||
      b.autor.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search);
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            // Busca a informação de quem está com o livro para exibir no card
            const loan = activeLoans.find((l) => l.livro_id === book.id);
            const member = loan ? members.find((m) => m.id === loan.membro_id) : null;
            
            return (
              <Card key={book.id} className="overflow-hidden">
                <div className="flex h-32 items-center justify-center bg-secondary">
                  {book.capa_url ? (
                    <img src={book.capa_url} alt={book.titulo} className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-semibold">{book.titulo}</h3>
                    <span className={
                      book.status === "DISPONIVEL"
                        ? "bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold"
                        : "bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-semibold"
                    }>
                      {book.status === "DISPONIVEL" ? "Disponível" : "Emprestado"}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{book.autor}</p>
                  
                  {/* Exibe o nome de quem pegou o livro, se estiver emprestado */}
                  {book.status === "EMPRESTADO" && member && (
                    <p className="mb-3 text-xs text-muted-foreground">
                      Com: <span className="font-medium text-foreground">{member.nome}</span>
                    </p>
                  )}
                  
                  {/* Botões de Ação Refatorados */}
                  <div className="flex gap-2">
                    {book.status === "DISPONIVEL" ? (
                      <Button size="sm" className="flex-1" onClick={() => setLoanBook(book)}>
                        Emprestar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setReturnBook(book)}
                      >
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

      {/* Modals (Aqui a mágica acontece) */}
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