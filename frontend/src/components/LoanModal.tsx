import { useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Book } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
  book?: Book;
}

export function LoanModal({ open, onClose, book }: Props) {
  const { members, addLoan, updateBook } = useLibrary();
  const [memberId, setMemberId] = useState("");

  const handleConfirm = () => {
    if (!book || !memberId) return;
    addLoan(book.id, memberId);
    updateBook(book.id, { status: "borrowed" });
    setMemberId("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setMemberId(""); onClose(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Empréstimo</DialogTitle>
          <DialogDescription>
            Escolha o membro que vai levar o livro <span className="font-medium">"{book?.title}"</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Membro</Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um membro" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setMemberId(""); onClose(); }}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!memberId}>Confirmar Empréstimo</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
