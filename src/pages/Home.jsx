import React from "react";
import Header from "../components/Header";
import "./Home.css";
import bookIllustration from "../assets/books-illustration.png";

export default function Home() {
  return (
    <div className="home-bg">
      <Header />
      <main className="home-main">
        <section className="home-section">
          <div className="home-content">
            <h1 className="home-title">
              Compartilhar livros,
              <br />é compartilhar mundos.
            </h1>
          </div>
          <div className="home-img-card">
            <img
              src={bookIllustration}
              alt="Ilustração de troca de livros"
              className="home-img"
            />
          </div>
        </section>
        <p className="home-desc">
          UniLivros é um espaço pensado para quem acredita que ler é mais do que
          virar páginas.
          <br />
          Aqui você pode montar sua estante virtual, trocar livros, conhecer
          novos leitores e transformar cada encontro em uma nova história.
        </p>
      </main>
    </div>
  );
}
