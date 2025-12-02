import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function SolicitarCodigo() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const safeJson = async (response) => {
    try {
      return await response.json();
    } catch (e) {
      return {}; // evita crash caso backend não envie JSON
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("Por favor, preencha seu e-mail.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Por favor, insira um e-mail válido (sem o domínio).");
      return;
    }

    const emailCompleto = `${email}@souunit.com.br`;
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCompleto }),
      });

      const data = await safeJson(response);

      if (response.ok) {
        toast.success(data.message || "Código enviado para seu e-mail!");
        navigate("/confirmar-codigo", {
          state: {
            email: emailCompleto,
            from: "forgot-password",
          },
        });
      } else {
        toast.error(
          data.message ||
            "Erro ao enviar código. Verifique se o e-mail está cadastrado."
        );
      }
    } catch (error) {
      console.error("Erro ao solicitar código:", error);

      if (error.message.includes("Failed to fetch")) {
        toast.error("Erro de conexão com o servidor. Verifique sua internet.");
      } else {
        toast.error("Erro ao conectar com o servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <h2 className="form-title">Recuperar Senha</h2>

          <p className="form-info-text">
            Digite seu e-mail institucional para enviarmos um código de
            recuperação.
          </p>

          <form className="form-form" onSubmit={handleSubmit}>
            <div className="email-row">
              <input
                type="text"
                placeholder="seu.usuario"
                className="form-input email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                disabled={isLoading}
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>

            <div className="form-actions">
              <button type="submit" className="form-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Enviando...
                  </>
                ) : (
                  "Enviar Código"
                )}
              </button>

              <button
                type="button"
                className="form-btn secondary-btn"
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                Voltar para Login
              </button>
            </div>
          </form>

          <div className="form-footer">
            <p className="form-help-text">
              Não recebeu o código? Verifique sua pasta de spam ou
              <button
                type="button"
                className="text-link"
                onClick={() =>
                  toast.info("Aguarde alguns minutos e tente novamente.")
                }
              >
                clique aqui para reenviar
              </button>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
