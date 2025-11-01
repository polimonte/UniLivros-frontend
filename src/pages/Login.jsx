import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Forms.css";
import "./Login.css";
import bookIcon from "../assets/book-icon.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      alert("Por favor, preencha o usuário e a senha.");
      return;
    }

    console.log("--- Dados do Login ---");
    console.log("Usuário:", email);
    console.log("Senha:", password);
    alert("Login simulado com sucesso! Redirecionando...");

    navigate("/dashboard");
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <form className="form-form" onSubmit={handleSubmit}>
            <div className="email-row">
              <input
                type="text"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>
            <input
              type="password"
              placeholder="Senha"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <div className="login-links">
              <Link to="/esqueceu-senha" className="login-forgot">
                Esqueceu a Senha?
              </Link>
            </div>

            <button type="submit" className="form-btn">
              Entrar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
