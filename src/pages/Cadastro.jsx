import React, { useState } from "react";
import Header from "../components/Header";
import "./Cadastro.css";
import bookIcon from "../assets/book-icon.jpg"; // ajuste a extensão conforme seu arquivo

export default function Cadastro() {
  const [username, setUsername] = useState("");

  return (
    <div className="cadastro-bg">
      <Header />
      <main className="cadastro-main">
        <section className="cadastro-card">
          <img src={bookIcon} alt="Ícone de livro" className="cadastro-icon" />
          <form className="cadastro-form">
            <input
              type="text"
              placeholder="Nome"
              className="cadastro-input"
              autoComplete="name"
            />
            <div className="email-row">
              <input
                type="text"
                placeholder="Usuário"
                className="cadastro-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>
            <input
              type="text"
              placeholder="Matrícula"
              className="cadastro-input"
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Senha"
              className="cadastro-input"
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirmação de senha"
              className="cadastro-input"
              autoComplete="new-password"
            />
            <button type="submit" className="cadastro-btn">
              Cadastrar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
