import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !email || !matricula || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não conferem!");
      return;
    }

    console.log("--- Dados do Cadastro ---");
    console.log("Nome:", name);
    console.log("Email:", email);
    console.log("Matrícula:", matricula);
    console.log("Senha:", password);

    alert("Cadastro simulado com sucesso! Confirme o código.");

    navigate("/confirmar-cadastro");
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <form className="form-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
            <div className="email-row">
              <input
                type="text"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>
            <input
              type="text"
              placeholder="Matrícula"
              className="form-input"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Senha"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirmação de senha"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button type="submit" className="form-btn">
              Cadastrar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
