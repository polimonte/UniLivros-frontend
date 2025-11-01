import React from "react";
import BookCard from "../components/BookCard";
import "./Dashboard.css";

import carasCoracoesImg from "../assets/books/caras-coracoes.jpg";
import harryPotterImg from "../assets/books/harry-potter.jpg";
import magicoOzImg from "../assets/books/magico-oz.jpg";
import memoriasPostumasImg from "../assets/books/memorias-postumas.jpg";
import heroBannerImg from "../assets/hero-banner.jpg";

export default function Dashboard() {
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
        <div className="book-grid">
          <BookCard
            id="caras-e-coracoes"
            imgSrc={carasCoracoesImg}
            title="Caras e Corações"
            author="Thomas Lopes"
            year="1990"
          />
          <BookCard
            id="harry-potter"
            imgSrc={harryPotterImg}
            title="O Prisioneiro de Azkaban"
            author="J.K. Rowling"
            year="2004"
          />
          <BookCard
            id="magico-de-oz"
            imgSrc={magicoOzImg}
            title="Mágico de Oz"
            author="L. Frank Baum"
            year="1984"
          />
          <BookCard
            id="memorias-postumas"
            imgSrc={memoriasPostumasImg}
            title="Memórias Póstumas"
            author="Machado de Assis"
            year="1881"
          />
        </div>
      </section>
    </main>
  );
}
