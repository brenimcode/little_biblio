import { useLoans } from "@/hooks/useLoans";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const LoansPage = () => {
  const { loans, loading, error } = useLoans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Empréstimos Ativos</h1>
        <p className="text-sm text-muted-foreground">{loans.length} empréstimo{loans.length !== 1 ? "s" : ""} em andamento</p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">Carregando...</CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center text-destructive">{error}</CardContent>
        </Card>
      ) : loans.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">Nenhum empréstimo ativo.</CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {loans.map((loan, idx) => {
            let dataEmprestimoStr = "";
            const dataObj = new Date(loan.data_emprestimo);
            if (loan.data_emprestimo && !isNaN(dataObj.getTime())) {
              dataEmprestimoStr = format(dataObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
            } else {
              dataEmprestimoStr = "Data inválida";
            }
            return (
              <Card key={idx}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{loan.titulo ?? "—"}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="outline">{loan.nome_membro ?? "—"}</Badge>
                      {loan.telefone && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" /> {loan.telefone}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Emprestado em {dataEmprestimoStr}
                    </p>
                  </div>
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
