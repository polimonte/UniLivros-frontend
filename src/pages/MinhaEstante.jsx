import React from "react";
import BookCard from "../components/BookCard";
import BookPlaceholderCard from "../components/BookPlaceholderCard";
import "./MinhasTrocas.css"; // Reutilizando o CSS da página Minhas Trocas

import magicoOzImg from "../assets/books/magico-oz.jpg";
import harryPotterImg from "../assets/books/harry-potter.jpg";
import memoriasPostumasImg from "../assets/books/memorias-postumas.jpg";

export default function MinhaEstante() {
  return (
    <main className="trocas-main">
      <h1 className="trocas-title">Minha Estante</h1>
      <h2 className="trocas-subtitle">Todos os livros na sua estante</h2>

      <div className="book-grid">
        <BookCard
          id="magico-de-oz"
          imgSrc={magicoOzImg}
          title="Mágico de Oz"
          author="L. Frank Baum"
          year="1984"
          buttonText="Ver Detalhes"
          buttonStyle="default"
        />
        <BookCard
          id="harry-potter"
          imgSrc={harryPotterImg}
          title="O Prisioneiro de Azkaban"
          author="J.K. Rowling"
          year="2004"
          buttonText="Ver Detalhes"
          buttonStyle="default"
        />
        <BookCard
          id="memorias-postumas"
          imgSrc={memoriasPostumasImg}
          title="Memórias Póstumas"
          author="Machado de Assis"
          year="1881"
          buttonText="Ver Detalhes"
          buttonStyle="default"
        />
        <BookPlaceholderCard />
      </div>
    </main>
  );
}
