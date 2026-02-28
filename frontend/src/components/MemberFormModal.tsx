import { useState, useEffect } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Member } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
  member?: Member;
}

export function MemberFormModal({ open, onClose, member }: Props) {
  const { addMember, updateMember } = useLibrary();
  const isEdit = !!member;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (member) {
      setName(member.name);
      setPhone(member.phone);
      setEmail(member.email);
    } else {
      setName("");
      setPhone("");
      setEmail("");
    }
  }, [member, open]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (isEdit) {
      updateMember(member.id, { name, phone, email });
    } else {
      addMember({ name, phone, email });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Membro" : "Novo Membro"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados do membro." : "Preencha os dados para cadastrar um novo membro."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {isEdit ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
