import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function ConfirmarCadastro() {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(3600); // 1 hora (60 minutos)
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Email não informado. Redirecionando...");
      setTimeout(() => navigate("/cadastro"), 2000);
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCodigo = [...codigo];
      newCodigo[index] = value;
      setCodigo(newCodigo);

      // Auto-focus próximo input
      if (value && index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newCodigo = [...codigo];
      digits.forEach((digit, index) => {
        if (index < 6) newCodigo[index] = digit;
      });
      setCodigo(newCodigo);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const fullCode = codigo.join("");
    if (!fullCode || fullCode.length < 6) {
      toast.error("Por favor, insira o código completo de 6 dígitos.");
      return;
    }

    if (timer <= 0) {
      toast.error("Código expirado. Solicite um novo código.");
      return;
    }

    // Recomendação: Verifique se o e-mail está disponível antes de submeter.
    if (!email) {
      toast.error("E-mail não encontrado. Por favor, volte ao cadastro.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/verify-email/${fullCode}`, // 1. URL corrigida (sem query param)
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // 2. 'body' movido para dentro do objeto de opções
            email: email, // 3. Adicionado o email no corpo da requisição (Recomendado)
            codigoVerificacao: fullCode,
          }),
        } // 4. Objeto de opções fechado corretamente
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Cadastro confirmado com sucesso!");
        navigate("/login", {
          state: {
            message: "Cadastro confirmado com sucesso!  Faça seu login.",
            type: "success",
          },
        });
      } else {
        toast.error(data.message || "Código inválido ou expirado.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email não disponível para reenvio.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/resend-verification-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Novo código enviado para seu email!");
        setTimer(3600); // Reset timer para 1 hora
        setCodigo(["", "", "", "", "", ""]); // Clear inputs
        document.getElementById("code-input-0").focus();
      } else {
        toast.error(data.message || "Erro ao reenviar código.");
      }
    } catch (error) {
      console.error("Erro:", error);
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

          <h2 className="form-title">Confirmar Cadastro</h2>

          <p className="form-info-text">
            Digite o código de 6 dígitos enviado para:
            <br />
            <strong>{email || "seu e-mail"}</strong>
          </p>

          <div className="timer-display">
            ⏰ Tempo restante:{" "}
            <span className={timer < 300 ? "timer-warning" : ""}>
              {formatTime(timer)}
            </span>
          </div>

          <form className="form-form" onSubmit={handleSubmit}>
            <div className="code-inputs-container">
              {codigo.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="1"
                  className="code-input"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isLoading || timer <= 0}
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <button
              type="submit"
              className="form-btn primary-btn"
              disabled={isLoading || timer <= 0}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Validando...
                </>
              ) : (
                "Confirmar Cadastro"
              )}
            </button>
          </form>

          <div className="form-footer">
            <p className="form-help-text">
              Não recebeu o código?{" "}
              <button
                type="button"
                className="text-link"
                onClick={handleResendCode}
                disabled={isLoading}
              >
                Clique aqui para reenviar
              </button>
            </p>

            {timer <= 0 && (
              <div className="expired-warning">
                ⚠️ Código expirado. Solicite um novo código.
              </div>
            )}

            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/cadastro")}
            >
              ← Voltar para Cadastro
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
