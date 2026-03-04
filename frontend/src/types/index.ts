export type Status = "DISPONIVEL" | "EMPRESTADO";

export interface Book {
  id: number;
  isbn: string;
  titulo: string;
  autor: string;
  capa_url?: string | null;
  status: Status;
}

export interface Member {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export interface Loan {
  id?: number;
  livro_id?: number;
  membro_id?: number;
  data_emprestimo: string;
  data_devolucao_prevista?: string;
  data_devolucao_real?: string | null;
  // Campos do RelatorioEmprestimo
  titulo: string;
  nome_membro: string;
  telefone: string;
}

export interface RelatorioEmprestimo {
  titulo: string;
  nome_membro: string;
  telefone: string;
}
