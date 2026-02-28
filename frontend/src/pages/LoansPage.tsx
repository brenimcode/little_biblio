import { useLibrary } from "@/contexts/LibraryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LoansPage = () => {
  const { activeLoans, books, members, returnLoan, updateBook } = useLibrary();

  const handleReturn = (loanId: string, bookId: string) => {
    returnLoan(loanId);
    updateBook(bookId, { status: "available" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Empréstimos Ativos</h1>
        <p className="text-sm text-muted-foreground">{activeLoans.length} empréstimo{activeLoans.length !== 1 ? "s" : ""} em andamento</p>
      </div>

      {activeLoans.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum empréstimo ativo.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeLoans.map((loan) => {
            const book = books.find((b) => b.id === loan.bookId);
            const member = members.find((m) => m.id === loan.memberId);
            return (
              <Card key={loan.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{book?.title ?? "—"}</p>
                    <p className="text-sm text-muted-foreground">
                      {book?.author}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="outline">{member?.name ?? "—"}</Badge>
                      {member?.phone && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" /> {member.phone}
                        </span>
                      )}
                      {member?.email && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" /> {member.email}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Emprestado em {format(new Date(loan.loanDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleReturn(loan.id, loan.bookId)}
                  >
                    Devolver
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LoansPage;
