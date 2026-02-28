import { useState, useEffect } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Book } from "@/types";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
  book?: Book;
}

export function BookFormModal({ open, onClose, book }: Props) {
  const { addBook, updateBook } = useLibrary();
  const isEdit = !!book;

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setIsbn(book.isbn);
      setCoverUrl(book.coverUrl);
    } else {
      setTitle("");
      setAuthor("");
      setIsbn("");
      setCoverUrl("");
    }
  }, [book, open]);

  const handleSubmit = () => {
    if (!title.trim() || !author.trim()) return;
    if (isEdit) {
      updateBook(book.id, { title, author, isbn, coverUrl });
    } else {
      addBook({ title, author, isbn, coverUrl });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Livro" : "Novo Livro"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Atualize os dados do livro." : "Preencha os dados para adicionar um livro ao acervo."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Dom Casmurro" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Autor *</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ex: Machado de Assis" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input id="isbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} placeholder="Ex: 978-8535910681" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cover">URL da Capa</Label>
            <Input id="cover" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !author.trim()}>
            {isEdit ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
