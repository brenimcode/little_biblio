import { useState } from "react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Member } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { MemberFormModal } from "@/components/MemberFormModal";

const MembersPage = () => {
  const { members, deleteMember, activeLoans } = useLibrary();
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);

  const getBorrowedCount = (memberId: string) =>
    activeLoans.filter((l) => l.memberId === memberId).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Membros</h1>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum membro cadastrado.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {members.map((member) => {
            const borrowed = getBorrowedCount(member.id);
            return (
              <Card key={member.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {borrowed > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {borrowed} livro{borrowed > 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {member.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {member.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setEditMember(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMember(member.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <MemberFormModal open={showAdd} onClose={() => setShowAdd(false)} />
      <MemberFormModal open={!!editMember} member={editMember ?? undefined} onClose={() => setEditMember(null)} />
    </div>
  );
};

export default MembersPage;
