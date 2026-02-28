export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  coverUrl: string;
  status: "available" | "borrowed";
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  memberId: string;
  loanDate: string;
  returnDate: string | null;
  active: boolean;
}
