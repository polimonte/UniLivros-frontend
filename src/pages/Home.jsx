import React from "react";
import Header from "../components/Header";
import "./Home.css";
import heroImage from "../assets/books-illustration.png";

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
            <img
              Src={heroImage}
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

        <section className="sobre-section">
          <h3 className="sobre-section-title" style={{ textAlign: "center" }}>
            COMO FUNCIONA?
          </h3>
          <div className="como-funciona-grid">
            <div className="como-funciona-card">
              <span className="card-number">01</span>
              <p className="card-text">
                Cadastre os livros que você já leu e não quer mais deixar eles
                parados.
              </p>
            </div>
            <div className="como-funciona-card">
              <span className="card-number">02</span>
              <p className="card-text">
                Explore a estante virtual de outros estudantes e encontre seu
                próximo livro favorito.
              </p>
            </div>
            <div className="como-funciona-card">
              <span className="card-number">03</span>
              <p className="card-text">
                Solicite a troca, combine um local seguro dentro da faculdade e
                pronto! Boa leitura!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
