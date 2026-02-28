import React, { createContext, useContext } from "react";
import { useBooks } from "@/hooks/useBooks";
import { useMembers } from "@/hooks/useMembers";
import { useLoans } from "@/hooks/useLoans";

type LibraryContextType = ReturnType<typeof useBooks> &
  ReturnType<typeof useMembers> &
  ReturnType<typeof useLoans>;

const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const booksData = useBooks();
  const membersData = useMembers();
  const loansData = useLoans();

  return (
    <LibraryContext.Provider value={{ ...booksData, ...membersData, ...loansData }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
