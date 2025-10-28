import React, { useState } from "react";
import Header from "../components/Header";
import "./Login.css";
import bookIcon from "../assets/book-icon.jpg"; // ajuste a extensão conforme seu arquivo

export default function Login() {
  const [email, setEmail] = useState("");

  return (
    <div className="login-bg">
      <Header />
      <main className="login-main">
        <section className="login-card">
          <img src={bookIcon} alt="Ícone de livro" className="login-icon" />
          <form className="login-form">
            <div className="email-row">
              <input
                type="text"
                placeholder="Email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>
            <input
              type="password"
              placeholder="Senha"
              className="login-input"
              autoComplete="current-password"
            />
            <div className="login-links">
              <a href="#" className="login-forgot">
                Esqueceu a Senha?
              </a>
            </div>
            <button type="submit" className="login-btn">
              Entrar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
