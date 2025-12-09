import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function ConfirmarCodigo() {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutos
  const [isValidating, setIsValidating] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const from = location.state?.from;

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

      if (value && index < 5) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }

      if (newCodigo.every((digit) => digit !== "") && index === 5) {
        handleValidateCode();
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
      handleValidateCode();
    }
  };

  const handleValidateCode = async () => {
    const fullCode = codigo.join("");

    if (!email) {
      toast.error("Email não identificado. Reinicie o processo.");
      navigate("/login");
      return;
    }

    if (fullCode.length !== 6) {
      toast.error("O código deve ter 6 dígitos.");
      return;
    }

    if (timer <= 0) {
      toast.error("Código expirado. Solicite um novo.");
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          code: fullCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        navigate("/nova-senha", {
          state: {
            email: email,
            code: fullCode,
            from: from,
          },
        });
      } else {
        toast.error(data.message || "Código inválido. Tente novamente.");
        setCodigo(["", "", "", "", "", ""]);
        document.getElementById("code-input-0").focus();
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao validar código. Verifique sua conexão.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleValidateCode();
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email não disponível para reenvio.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Novo código enviado!");
        setTimer(300);
        setCodigo(["", "", "", "", "", ""]);
        document.getElementById("code-input-0").focus();
      } else {
        toast.error(data.message || "Erro ao reenviar código.");
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

          <h2 className="form-title">Confirmar Código</h2>

          <p className="form-info-text">
            Enviamos um código de confirmação para:
            <br />
            <strong>{email || "seu e-mail"}</strong>
          </p>

          <div className="timer-display">
            ⏰ Tempo restante:{" "}
            <span className={timer < 60 ? "timer-warning" : ""}>
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
              disabled={
                isValidating || timer <= 0 || codigo.some((d) => d === "")
              }
            >
              {isValidating ? (
                <>
                  <span className="spinner"></span>
                  Validando...
                </>
              ) : (
                "Confirmar Código"
              )}
            </button>
          </form>

          <div className="form-footer">
            <p className="form-help-text">
              Não recebeu o código?
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
              onClick={() =>
                navigate(
                  from === "forgot-password" ? "/solicitar-codigo" : "/login"
                )
              }
            >
              ← Voltar
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
