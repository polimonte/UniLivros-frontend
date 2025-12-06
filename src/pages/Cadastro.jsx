import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import bookIcon from "../assets/book-icon.jpg";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [matricula, setMatricula] = useState("");
  const [curso, setCurso] = useState("");
  const [semestre, setSemestre] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

    if (
      !name ||
      !email ||
      !matricula ||
      !curso ||
      !semestre ||
      !password ||
      !confirmPassword
    ) {
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

    const emailCompleto = `${email}@souunit.com. br`;

    try {
      // ===== CORREÇÃO: Converter semestre para número =====
      const semestreNumero = parseInt(semestre, 10);

      if (isNaN(semestreNumero) || semestreNumero < 1 || semestreNumero > 12) {
        toast.error("Semestre deve ser um número entre 1 e 12");
        setIsLoading(false);
        return;
      }

      console.log("Enviando dados:", {
        nome: name,
        email: emailCompleto,
        matricula,
        senha: password,
        curso,
        semestre: semestreNumero, // ← Agora é número
      });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: name,
          email: emailCompleto,
          matricula: matricula,
          curso: curso,
          semestre: semestreNumero, // ← ALTERAÇÃO: Envia como número
          senha: password,
        }),
      });
      // ====================================================

      const data = await response.json();

      if (response.ok) {
        navigate("/login", {
          state: {
            message:
              "Cadastro realizado com sucesso!  Faça login para continuar.",
          },
        });
      } else {
        console.error("Erro retornado pelo Backend:", data);
        const msg = data.message || data.error || JSON.stringify(data);
        toast.error(`Erro: ${msg}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro de conexão com o servidor.");
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
              type="text"
              placeholder="Curso"
              className="form-input"
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              autoComplete="off"
            />
            {/* ===== ALTERAÇÃO: Mudei para type="number" ===== */}
            <input
              type="number"
              placeholder="Semestre (1-12)"
              className="form-input"
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              min="1"
              max="12"
              autoComplete="off"
            />
            {/* =============================================== */}

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="form-input"
                value={password}
                onChange={handlePasswordChange}
                autoComplete="new-password"
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
                placeholder="Confirmação de senha"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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

            <button
              type="submit"
              className="form-btn"
              disabled={isLoading || passwordStrength < 50}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </button>
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
