import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function SolicitarCodigo() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const safeJson = async (response) => {
    try {
      return await response.json();
    } catch (e) {
      return {}; // evita crash caso backend não envie JSON
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Por favor, preencha seu e-mail.");
      return;
    }

    const emailCompleto = `${email}@souunit.com.br`;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCompleto }),
      });

      const data = await safeJson(response);

      if (response.ok) {
        toast.success(data.message || "Código enviado!");
        navigate("/confirmar-codigo", { state: { email: emailCompleto } });
      } else {
        toast.error(data.message || "Erro ao enviar código.");
      }
    } catch (error) {
      console.error("Erro ao solicitar código:", error);
      toast.error("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <p className="form-info-text">
            Digite seu e-mail para enviarmos um código de recuperação.
          </p>

          <form className="form-form" onSubmit={handleSubmit}>
            <div className="email-row">
              <input
                type="text"
                placeholder="Seu e-mail"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>

            <button type="submit" className="form-btn">
              Enviar Código
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
