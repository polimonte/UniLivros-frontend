import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "./Modal";
import { API_BASE_URL } from "../services/api";
import "./AddBookModal.css";

export default function AddBookModal({
  isOpen,
  onClose,
  initialBook = null,
  onSuccess,
}) {
  const [step, setStep] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedBook, setSelectedBook] = useState(null);
  const [condicao, setCondicao] = useState("USADO_BOM"); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialBook) {
        setSelectedBook(initialBook);
        setStep("confirm");
      } else {
        setSelectedBook(null);
        setStep("search");
        setSearchResults([]);
        setSearchQuery("");
      }
      setCondicao("USADO_BOM");
    }
  }, [isOpen, initialBook]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&maxResults=5`
      );
      const data = await response.json();

      const books = (data.items || []).map((item) => ({
        titulo: item.volumeInfo.title,
        autor: item.volumeInfo.authors
          ? item.volumeInfo.authors[0]
          : "Autor Desconhecido",
        editora: item.volumeInfo.publisher || "Editora não informada",
        genero: item.volumeInfo.categories ? item.volumeInfo.categories[0] : "Geral",
        ano: item.volumeInfo.publishedDate
          ? item.volumeInfo.publishedDate.substring(0, 4)
          : "2000", 
        imagemUrl: item.volumeInfo.imageLinks?.thumbnail || "",
        descricao: item.volumeInfo.description || "",
        googleId: item.id, 
        isbn: (item.volumeInfo.industryIdentifiers && item.volumeInfo.industryIdentifiers.length > 0) ? item.volumeInfo.industryIdentifiers[0].identifier : ""
      }));

      setSearchResults(books);
    } catch (error) {
      toast.error("Erro ao buscar livros no Google.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setStep("confirm");
  };

  const handleSubmit = async () => {
    if (!selectedBook) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Você precisa estar logado.");
        return;
      }

      const payload = {
        titulo: selectedBook.titulo,
        autor: selectedBook.autor,
        editora: selectedBook.editora || "Editora não informada",
        genero: selectedBook.genero || "Geral",
        isbn: selectedBook.isbn || "",
        ano: parseInt(selectedBook.ano) || 2000,
        descricao: selectedBook.descricao ? selectedBook.descricao.substring(0, 499) : "", 
        condicao: condicao, 
      };

      console.log("Enviando Payload:", payload);

      const response = await fetch(`${API_BASE_URL}/livros`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Livro adicionado à estante!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const data = await response.json();
        
        if (data.errors && Array.isArray(data.errors)) {
            const msgs = data.errors.map(e => e.defaultMessage).join(", ");
            toast.error("Erro de validação: " + msgs);
        } else {
            toast.error(data.message || "Erro ao adicionar livro.");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="add-book-modal-content">
        {step === "search" ? (
          <>
            <h2 className="modal-title">Adicionar Novo Livro</h2>
            <form onSubmit={handleSearch} className="search-box-wrapper">
              <input
                type="text"
                placeholder="Digite o nome do livro, autor ou ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" disabled={isSearching}>
                {isSearching ? "..." : "🔍"}
              </button>
            </form>

            <div className="search-results-list">
              {searchResults.map((book) => (
                <div
                  key={book.googleId}
                  className="search-result-item"
                  onClick={() => handleSelectBook(book)}
                >
                  <img
                    src={book.imagemUrl || "https://via.placeholder.com/50x75"}
                    alt="Capa"
                  />
                  <div className="search-result-info">
                    <h4>{book.titulo}</h4>
                    <p>
                      {book.autor} • {book.ano}
                    </p>
                  </div>
                  <button className="btn-select">Selecionar</button>
                </div>
              ))}
              {searchResults.length === 0 && searchQuery && !isSearching && (
                <p className="no-results">Nenhum livro encontrado.</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="modal-title">Confirmar Dados</h2>
            {selectedBook && (
              <div className="confirm-book-details">
                <img
                  src={
                    selectedBook.imagemUrl ||
                    "https://via.placeholder.com/100x150"
                  }
                  alt="Capa"
                  className="confirm-cover"
                />
                <div className="confirm-info">
                  <h3>{selectedBook.titulo}</h3>
                  <p>
                    <strong>Autor:</strong> {selectedBook.autor}
                  </p>
                  <p>
                    <strong>Editora:</strong> {selectedBook.editora || "Não informada"}
                  </p>
                  <p>
                    <strong>Ano:</strong> {selectedBook.ano}
                  </p>

                  <div className="form-group">
                    <label>Estado de Conservação:</label>
                    <select
                      value={condicao}
                      onChange={(e) => setCondicao(e.target.value)}
                    >
                      <option value="NOVO">Novo</option>
                      <option value="SEMI_NOVO">Seminovo</option>
                      <option value="USADO_BOM">Usado - Bom Estado</option>
                      <option value="USADO_REGULAR">Usado - Regular</option>
                      <option value="USADO_RUIM">Usado - Ruim</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="modal-actions">
              {!initialBook && (
                <button className="btn-back" onClick={() => setStep("search")}>
                  Voltar
                </button>
              )}
              <button className="btn-cancel" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn-confirm"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando..." : "Confirmar e Adicionar"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}