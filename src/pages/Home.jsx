import React from "react";
import "./Home.css"; // Importa o CSS separado
import bookIllustration from "../assets/books-illustration.png";

export default function Home() {
  return (
    <div className="home-bg">
      <header className="home-header">
        <span className="home-logo">UniLivros</span>
        <div>
          <button className="btn-cadastro">Cadastre-se</button>
          <button className="btn-login">Login</button>
        </div>
      </header>
      <main className="home-main">
        <section className="home-section">
          <div className="home-content">
            <h1 className="home-title">
              Compartilhar livros,
              <br />é compartilhar mundos.
            </h1>

            <p className="home-desc">
              UniLivros é um espaço pensado para quem acredita que ler é mais do
              que virar páginas.
              <br />
              Aqui você pode montar sua estante virtual, trocar livros, conhecer
              novos leitores e transformar cada encontro em uma nova história.
            </p>
          </div>
          <img src={bookIllustration} alt="Ilustração de livros" />
        </section>
      </main>
    </div>
  );
}
