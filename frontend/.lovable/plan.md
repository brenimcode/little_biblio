

# Little Biblio — Plano de Implementação

## Visão Geral
Sistema web minimalista para gestão de bibliotecas físicas pessoais e de pequenas organizações. Design **clean modern**, mobile-first, com paleta em tons de **verde sálvia** e fundo off-white.

> **Nota:** Nesta primeira fase, os dados serão armazenados localmente no navegador (localStorage). Futuramente, podemos conectar um backend com Supabase para persistência real e autenticação.

---

## 1. Design System & Layout Base
- Paleta de cores customizada: fundo off-white, acentos em **verde sálvia** e azul profundo
- Layout responsivo mobile-first com navegação lateral (desktop) e bottom nav (mobile)
- Tipografia limpa e generoso uso de espaço em branco

## 2. Dashboard (Página Inicial)
- **Cards de resumo** com: Total de Livros, Livros Disponíveis, Livros Emprestados, Membros Ativos
- **Lista rápida** dos empréstimos ativos com nome do membro e livro
- Ações rápidas: "Adicionar Livro", "Novo Empréstimo"

## 3. Catálogo de Livros (HU02, HU05, HU09)
- Grid/lista de livros com **cards visuais** mostrando capa, título, autor e badge de status (Disponível/Emprestado)
- **Busca em tempo real** por título, autor ou ISBN
- **Filtro por status**: Todos / Disponíveis / Emprestados
- Botão para adicionar novo livro

## 4. Adicionar/Editar Livro (HU01, HU08)
- **Modal limpo** com campos: Título, Autor, ISBN, Upload de capa (ou URL)
- Validação inline dos campos obrigatórios
- Modo de edição reutilizando o mesmo modal

## 5. Fluxo de Empréstimo em 3 Cliques (HU03, HU04)
- **Clique 1:** No card do livro, botão "Emprestar"
- **Clique 2:** Modal abre com select de membros para escolher quem está pegando
- **Clique 3:** Confirmar empréstimo → status muda instantaneamente
- Para devolução: botão "Devolver" direto no card do livro emprestado (1 clique + confirmação)

## 6. Gestão de Membros (HU07)
- Página com lista/tabela de membros (nome, telefone, email)
- Modal para adicionar/editar membro
- Indicador de quantos livros cada membro tem emprestado

## 7. Lista de Empréstimos Ativos (HU06)
- Tabela/lista com: livro, membro responsável, contato (telefone/email), data do empréstimo
- Ação rápida de "Registrar Devolução" em cada linha
- Filtro e ordenação por data

## 8. Persistência Local
- Dados salvos em **localStorage** (livros, membros, empréstimos)
- Hooks customizados para CRUD de cada entidade
- Dados de exemplo pré-carregados para demonstração

