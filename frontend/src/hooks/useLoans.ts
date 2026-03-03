import { useEffect, useState } from "react";
import { Loan } from "@/types";

const API_URL = "http://localhost:8080/emprestimos";

export function useLoans() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/relatorio`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar empréstimos");
        return res.json();
      })
      .then(setLoans)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addLoan = async (loanData: { livro_id: number; membro_id: number; data_devolucao_prevista: string }) => {
    setLoading(true);
    setError(null);
    try {
      // Monta o payload conforme EmprestimoCreate
      const payload = {
        livro_id: loanData.livro_id,
        membro_id: loanData.membro_id,
        data_devolucao_prevista: loanData.data_devolucao_prevista
      };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Erro ao registrar empréstimo");
      const newLoan = await res.json();
      setLoans((prev) => [...prev, newLoan]);
      return newLoan;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const returnLoan = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}/devolucao`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Erro ao finalizar devolução");
      const updatedLoan = await res.json();
      setLoans((prev) => prev.map((l) => (l.id === id ? updatedLoan : l)));
      return updatedLoan;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const activeLoans = Array.isArray(loans) ? loans.filter((l) => !l.data_devolucao_real) : [];
  return { loans, activeLoans, addLoan, returnLoan, loading, error };
}
