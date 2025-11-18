import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import BookPlaceholderCard from "../components/BookPlaceholderCard";
import "./MinhasTrocas.css"; // Reutilizando CSS

export default function MinhaEstante() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyBooks() {
      try {
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=subject:design&maxResults=5"
        );
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
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyBooks();
  }, []);

  return (
    <main className="trocas-main">
      <h1 className="trocas-title">Minha Estante</h1>
      <h2 className="trocas-subtitle">Todos os livros na sua estante</h2>

      <div className="book-grid">
        {isLoading ? (
          <p>Carregando estante...</p>
        ) : (
          <>
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

            <BookPlaceholderCard />
            <BookPlaceholderCard />
          </>
        )}
      </div>
    </main>
  );
}
