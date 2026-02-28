import { useLocalStorage } from "./useLocalStorage";
import { Loan } from "@/types";

const SEED_LOANS: Loan[] = [
  { id: "l1", bookId: "b2", memberId: "m1", loanDate: "2024-06-10", returnDate: null, active: true },
  { id: "l2", bookId: "b5", memberId: "m2", loanDate: "2024-06-15", returnDate: null, active: true },
];

export function useLoans() {
  const [loans, setLoans] = useLocalStorage<Loan[]>("littlebiblio_loans", SEED_LOANS);

  const addLoan = (bookId: string, memberId: string) => {
    const newLoan: Loan = {
      id: crypto.randomUUID(),
      bookId,
      memberId,
      loanDate: new Date().toISOString(),
      returnDate: null,
      active: true,
    };
    setLoans((prev) => [...prev, newLoan]);
    return newLoan;
  };

  const returnLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId ? { ...l, active: false, returnDate: new Date().toISOString() } : l
      )
    );
  };

  const activeLoans = loans.filter((l) => l.active);

  return { loans, activeLoans, addLoan, returnLoan };
}
