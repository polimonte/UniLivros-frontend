import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function NovaSenha() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { email, code } = location.state || {};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !code) {
      toast.error("Dados da sessão perdidos. Reinicie o processo.");
      navigate("/login");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não conferem!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          code: code,
          newPassword: password,
        }),
      });

      if (response.ok) {
        toast.success("Senha redefinida com sucesso!");
        navigate("/login", {
          state: { message: "Senha redefinida com sucesso! Faça seu login." },
        });
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao redefinir senha.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
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
              placeholder="Confirme a Senha"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            <button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Confirmar"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
