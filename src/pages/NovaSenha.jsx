import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function NovaSenha() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem!");
      return;
    }

    console.log("--- Nova Senha ---");
    console.log("Senha definida:", password);

    navigate("/login", {
      state: { message: "Senha redefinida com sucesso! Faça seu login." },
    });
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <p className="form-info-text">Defina sua nova senha.</p>

          <form className="form-form" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Nova Senha"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirme Senha"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button type="submit" className="form-btn">
              Confirmar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
