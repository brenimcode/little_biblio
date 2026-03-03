import { useEffect, useState } from "react";
import { Member } from "@/types";

const API_URL = "http://localhost:8080/membros";

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar membros");
        return res.json();
      })
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addMember = async (member: Omit<Member, "id" | "createdAt">) => {
    setLoading(true);
    setError(null);
    try {
      // Monta o payload conforme MembroCreate
      const payload = {
        nome: member.nome,
        email: member.email,
        telefone: member.telefone
      };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao cadastrar membro");
      const newMember = await res.json();
      setMembers((prev) => [...prev, newMember]);
      return newMember;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // update/delete não implementados no backend

  return { members, addMember, loading, error };
}
