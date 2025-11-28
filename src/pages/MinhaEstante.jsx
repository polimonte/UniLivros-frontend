import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import BookCard from "../components/BookCard";
import BookPlaceholderCard from "../components/BookPlaceholderCard";
import AddBookModal from "../components/AddBookModal";
import { API_BASE_URL } from "../services/api";
import "./MinhasTrocas.css";

export default function MinhaEstante() {
  const { booksUpdateTrigger } = useOutletContext() || {};

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);

  const fetchMyBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado.");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/livros/meus-livros`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Falha ao carregar sua estante.");

      const backendBooks = await response.json();

      const booksWithImages = await Promise.all(
        backendBooks.map(async (item) => {
          let googleImage = null;
          let googleYear = item.ano || "N/A";

          try {
            const googleRes = await fetch(
              `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                item.titulo
              )}&maxResults=1`
            );
            const googleData = await googleRes.json();

            if (googleData.items && googleData.items.length > 0) {
              const volumeInfo = googleData.items[0].volumeInfo;
              googleImage = volumeInfo.imageLinks?.thumbnail;
              if (!item.ano && volumeInfo.publishedDate) {
                googleYear = volumeInfo.publishedDate.substring(0, 4);
              }
            }
          } catch (err) {
            console.error("Erro ao buscar imagem no Google Books", err);
          }

          return {
            id: item.id,
            title: item.titulo,
            author: item.autor,
            imgSrc: googleImage,
            year: googleYear,
          };
        })
      );

      setBooks(booksWithImages);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar livros. Verifique a conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, [booksUpdateTrigger]);

  const handleOpenAddModal = () => {
    setIsAddBookModalOpen(true);
  };

  const handleSuccessAdd = () => {
    setIsLoading(true);
    fetchMyBooks();
  };

  return (
    <main className="trocas-main">
      <h1 className="trocas-title">Minha Estante</h1>
      <h2 className="trocas-subtitle">
        Gerencie seus livros disponíveis para troca
      </h2>

      {isLoading && <p>Carregando sua estante...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!isLoading && !error && (
        <>
          {books.length === 0 ? (
            <div className="empty-shelf-container">
              <p className="empty-shelf-text">
                Você ainda não tem livros cadastrados na sua estante.
              </p>
              <p className="empty-shelf-subtext">
                Que tal desapegar daquele livro que você já leu?
              </p>
              <button
                className="btn-add-first-book"
                onClick={handleOpenAddModal}
              >
                + Adicionar meu primeiro livro
              </button>
            </div>
          ) : (
            <div className="book-grid">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  imgSrc={book.imgSrc}
                  title={book.title}
                  author={book.author}
                  year={book.year}
                  buttonText="Ver Detalhes"
                  buttonStyle="default"
                />
              ))}
              <div onClick={handleOpenAddModal} style={{ cursor: "pointer" }}>
                <BookPlaceholderCard />
              </div>
            </div>
          )}
        </>
      )}

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        initialBook={null}
        onSuccess={handleSuccessAdd}
      />
    </main>
  );
}
