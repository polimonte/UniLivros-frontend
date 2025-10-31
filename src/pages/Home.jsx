import React from "react";
import Header from "../components/Header";
import "./Home.css"; // Importa o CSS da Home
import heroImage from "../assets/books-illustration.png"; // Ajuste o caminho se necessário

export default function Home() {
  return (
    <div className="home-container">
      <Header />
      <main className="home-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Compartilhar livros,
              <br />é compartilhar mundos.
            </h1>
          </div>
          <div className="hero-image-wrapper">
            {/* Imagem do hero que você forneceu */}
            <img
              src={heroImage}
              alt="Pessoas compartilhando livros"
              className="hero-image"
            />
          </div>
        </section>

        <section className="about-section">
          <p className="about-text">
            UniLivros é um espaço pensado para quem acredita que ler é mais do
            que virar páginas. Aqui você pode montar sua estante virtual, trocar
            livros, conhecer novos leitores e transformar cada encontro em uma
            nova história.
          </p>
        </section>
      </main>
    </div>
  );
}
