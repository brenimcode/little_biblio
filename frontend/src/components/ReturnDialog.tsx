import { useLibrary } from "@/contexts/LibraryContext";
import { Book } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  book?: Book;
}

export function ReturnDialog({ open, onClose, book }: Props) {
  const { activeLoans, returnLoan, updateBook } = useLibrary();

  const handleReturn = () => {
    if (!book) return;
    const loan = activeLoans.find((l) => l.bookId === book.id);
    if (loan) {
      returnLoan(loan.id);
      updateBook(book.id, { status: "available" });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar Devolução</DialogTitle>
          <DialogDescription>
            Confirma a devolução do livro <span className="font-medium">"{book?.title}"</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleReturn}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
