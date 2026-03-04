import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Book } from "@/types";
import { useLibrary } from "@/contexts/LibraryContext";

interface ReturnDialogProps {
  open: boolean;
  book?: Book;
  onClose: () => void;
}

export function ReturnDialog({ open, book, onClose }: ReturnDialogProps) {
  const [loading, setLoading] = useState(false);
  const { activeLoans } = useLibrary(); // Puxamos os empréstimos do contexto para achar o ID

  // Se o modal estiver fechado ou o livro não tiver chegado, não renderiza nada
  if (!book) return null;

  // Precisamos descobrir QUAL é o ID do empréstimo ativo deste livro
  const currentLoan = activeLoans.find((loan) => loan.livro_id === book.id);

  const handleReturn = async () => {
    if (!currentLoan) {
      alert("Erro: Não encontramos o registro de empréstimo ativo para este livro.");
      return;
    }

    try {
      setLoading(true);
      
      // Chamada para a sua API FastAPI
      // Lembre-se de verificar se a porta do FastAPI é 8000 ou 8080!
      const res = await fetch(`http://localhost:8080/emprestimos/${currentLoan.id}/devolucao`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Falha ao devolver no servidor");
      }

      // Sucesso! Fecha o modal e recarrega a página para atualizar os status
      onClose();
      window.location.reload(); 

    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao tentar devolver o livro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Devolução</DialogTitle>
          <DialogDescription>
            Você está prestes a registrar a devolução do seguinte livro:
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center text-lg font-semibold text-primary">
            "{book.titulo}"
          </p>
          {/* Exibe o autor para dar mais certeza ao usuário */}
          <p className="text-center text-sm text-muted-foreground mt-1">
            Autor: {book.autor}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleReturn} disabled={loading}>
            {loading ? "Processando..." : "Confirmar Devolução"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}