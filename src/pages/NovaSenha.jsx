import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function NovaSenha() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { email, code } = location.state || {};

  const validatePassword = (password) => {
    if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres";
    if (!/[A-Z]/.test(password)) return "Inclua pelo menos uma letra maiúscula";
    if (!/[0-9]/.test(password)) return "Inclua pelo menos um número";
    return null;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "#ff4444";
    if (passwordStrength < 75) return "#ffbb33";
    return "#00C851";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !code) {
      toast.error("Sessão expirada. Reinicie o processo de recuperação.");
      navigate("/login");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
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

      const data = await response.json();

      if (response.ok) {
        navigate("/login", {
          state: {
            message: "Senha redefinida com sucesso! Faça seu login.",
            type: "success",
          },
        });
      } else {
        toast.error(
          data.message || "Erro ao redefinir senha. O código pode ter expirado."
        );
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro de conexão. Verifique sua internet.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          <h2 className="form-title">Nova Senha</h2>

          <p className="form-info-text">
            Digite sua nova senha para a conta:
            <br />
            <strong>{email}</strong>
          </p>

          <form className="form-form" onSubmit={handleSubmit}>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nova Senha (mínimo 6 caracteres)"
                className="form-input"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {password && (
              <div className="password-strength">
                <div
                  className="strength-bar"
                  style={{
                    width: `${passwordStrength}%`,
                    backgroundColor: getStrengthColor(),
                  }}
                ></div>
                <div className="strength-text">
                  Força da senha:{" "}
                  {passwordStrength < 50
                    ? "Fraca"
                    : passwordStrength < 75
                    ? "Média"
                    : "Forte"}
                </div>
              </div>
            )}

            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirme a Senha"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="form-btn primary-btn"
                disabled={isLoading || passwordStrength < 50}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Salvando...
                  </>
                ) : (
                  "Confirmar Nova Senha"
                )}
              </button>

              <button
                type="button"
                className="form-btn secondary-btn"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          </form>

          <div className="form-footer">
            <p className="form-help-text">
              Sua senha deve conter:
              <ul className="password-requirements">
                <li>✓ Pelo menos 6 caracteres</li>
                <li>✓ Pelo menos uma letra maiúscula</li>
                <li>✓ Pelo menos um número</li>
              </ul>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
