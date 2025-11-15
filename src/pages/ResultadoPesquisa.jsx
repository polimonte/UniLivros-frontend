import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import "./MinhasTrocas.css"; // Reutilizando o CSS

export default function ResultadoPesquisa() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setIsLoading(false);
      return;
    }

    async function fetchBooks() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12`
        );
        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API");
        }
        const data = await response.json();

        const processedBooks = (data.items || []).map((item) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors
            ? item.volumeInfo.authors[0]
            : "Autor desconhecido",
          imgSrc: item.volumeInfo.imageLinks?.thumbnail,
          year: item.volumeInfo.publishedDate
            ? item.volumeInfo.publishedDate.substring(0, 4)
            : "N/A",
        }));

        setBooks(processedBooks);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBooks();
  }, [query]);

  return (
    <main className="trocas-main">
      <h1 className="trocas-title">Resultados da Pesquisa</h1>
      <h2 className="trocas-subtitle">
        {isLoading
          ? "Buscando..."
          : error
          ? "Erro na busca"
          : books.length > 0
          ? `Mostrando resultados para "${query}"`
          : `Nenhum resultado encontrado para "${query}"`}
      </h2>

      {isLoading && <p>Carregando livros...</p>}
      {error && <p>Erro ao carregar livros: {error}</p>}

      {!isLoading && !error && (
        <div className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              imgSrc={book.imgSrc}
              title={book.title}
              author={book.author}
              year={book.year}
              buttonStyle="default"
            />
          ))}
        </div>
      )}
    </main>
  );
}
