import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function ConfirmarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // O email deve vir da página anterior (EsqueceuSenha)
  const email = location.state?.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!codigo) {
      toast.error("Por favor, insira o código.");
      return;
    }
    if (!email) {
      toast.error("Email não identificado. Reinicie o processo.");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: codigo }),
      });

      if (response.ok) {
        toast.success("Código validado!");
        // Passamos o email e o código para a próxima tela para autorizar a troca
        navigate("/nova-senha", { state: { email, code: codigo } });
      } else {
        toast.error("Código inválido.");
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

          <p className="form-info-text">
            Enviamos um código de confirmação para: <strong>{email}</strong>
          </p>

          <form className="form-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Código de Confirmação"
              className="form-input"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? "Validando..." : "Confirmar"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
