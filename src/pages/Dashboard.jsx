import React, { useState, useEffect } from "react";
import BookCard from "../components/BookCard";
import "./Dashboard.css";
import heroBannerImg from "../assets/hero-banner.jpg";

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch(
          "https://www.googleapis.com/books/v1/volumes?q=literatura+brasileira&maxResults=8"
        );
        if (!response.ok) {
          throw new Error("Falha ao buscar dados da API");
        }
        const data = await response.json();

        const processedBooks = data.items.map((item) => ({
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
  }, []);

  return (
    <main className="dashboard-main">
      <section className="dashboard-hero">
        <img src={heroBannerImg} alt="Banner" className="hero-image" />
        <div className="hero-text">
          <h2>LIVROS PARADOS?</h2>
          <p>DÊ A ELES UMA NOVA HISTÓRIA!</p>
        </div>
        <div className="hero-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </section>

      <section className="book-list-section">
        <h2 className="section-title">Livros Destaques</h2>

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
      </section>
    </main>
  );
}
