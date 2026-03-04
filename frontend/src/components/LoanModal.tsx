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
    // Define data_devolucao_prevista para daqui 7 dias
    const dataDevolucaoPrevista = new Date();
    dataDevolucaoPrevista.setDate(dataDevolucaoPrevista.getDate() + 7);
    const payload = {
      livro_id: book.id,
      membro_id: Number(memberId),
      data_devolucao_prevista: dataDevolucaoPrevista.toISOString()
    };
    addLoan(payload);
    setMemberId("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { setMemberId(""); onClose(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Empréstimo</DialogTitle>
          <DialogDescription>
            Escolha o membro que vai levar o livro <span className="font-medium">"{book?.titulo}"</span>.
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
                  <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>
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
