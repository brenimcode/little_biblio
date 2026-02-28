import { useLocalStorage } from "./useLocalStorage";
import { Member } from "@/types";

const SEED_MEMBERS: Member[] = [
  { id: "m1", name: "Ana Silva", phone: "(11) 98765-4321", email: "ana@email.com", createdAt: "2024-01-10" },
  { id: "m2", name: "Carlos Souza", phone: "(21) 91234-5678", email: "carlos@email.com", createdAt: "2024-01-15" },
  { id: "m3", name: "Beatriz Lima", phone: "(31) 99876-5432", email: "bia@email.com", createdAt: "2024-02-01" },
];

export function useMembers() {
  const [members, setMembers] = useLocalStorage<Member[]>("littlebiblio_members", SEED_MEMBERS);

  const addMember = (member: Omit<Member, "id" | "createdAt">) => {
    const newMember: Member = {
      ...member,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateMember = (id: string, data: Partial<Member>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return { members, addMember, updateMember, deleteMember };
}
