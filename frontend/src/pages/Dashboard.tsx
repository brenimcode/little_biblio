import { useLibrary } from "@/contexts/LibraryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ArrowLeftRight, Plus, BookCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const { books, members, activeLoans, loans } = useLibrary();
  const navigate = useNavigate();

  const safeBooks = Array.isArray(books) ? books : [];
  const safeMembers = Array.isArray(members) ? members : [];
  const safeActiveLoans = Array.isArray(activeLoans) ? activeLoans : [];

  const availableBooks = safeBooks.filter((b) => b.status === "DISPONIVEL").length;
  const borrowedBooks = safeBooks.filter((b) => b.status === "EMPRESTADO").length;

  const stats = [
    { label: "Total de Livros", value: safeBooks.length, icon: BookOpen, color: "text-primary" },
    { label: "Disponíveis", value: availableBooks, icon: BookCheck, color: "text-primary" },
    { label: "Emprestados", value: borrowedBooks, icon: ArrowLeftRight, color: "text-accent" },
    { label: "Membros", value: safeMembers.length, icon: Users, color: "text-accent" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral da sua biblioteca</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate("/books?action=add")}>
            <Plus className="h-4 w-4" /> Adicionar Livro
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-lg bg-secondary p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active loans list */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Empréstimos Ativos</h2>
        {safeActiveLoans.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Nenhum empréstimo ativo no momento.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {activeLoans.map((loan, idx) => {
              let dataEmprestimoStr = "";
              const dataObj = new Date(loan.data_emprestimo);
              if (loan.data_emprestimo && !isNaN(dataObj.getTime())) {
                dataEmprestimoStr = format(dataObj, "dd MMM yyyy", { locale: ptBR });
              } else {
                dataEmprestimoStr = "Data inválida";
              }
              return (
                <Card key={idx}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{loan.titulo ?? "Livro removido"}</p>
                      <p className="text-sm text-muted-foreground">
                        com <span className="font-medium text-foreground">{loan.nome_membro ?? "—"}</span>
                        {" · "}
                        {dataEmprestimoStr}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2 shrink-0">Emprestado</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
