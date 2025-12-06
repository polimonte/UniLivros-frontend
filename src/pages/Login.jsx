import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "../components/Header";
import { API_BASE_URL } from "../services/api";
import "./Forms.css";
import "./Login.css";
import bookIcon from "../assets/book-icon.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (location.state?.message && !toastShownRef.current) {
      toast.success(location.state.message);
      toastShownRef.current = true;
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha o usuário e a senha.");
      return;
    }

    setIsLoading(true);

    const emailCompleto = `${email}@souunit.com.br`;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCompleto, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Salvar o token
        if (data.token) {
          localStorage.setItem("token", data.token);
          console.log("✅ Token salvo no localStorage");
        } else {
          console.error("❌ Token não veio na resposta:", data);
        }

        // ===== CORREÇÃO: A API retorna 'usuario' não 'user' =====
        const userData = data.usuario || data.user;

        if (userData) {
          const userString = JSON.stringify(userData);
          localStorage.setItem("user", userString);
          console.log("✅ Usuário salvo no localStorage:", userString);
        } else {
          console.error("❌ Dados do usuário não vieram na resposta:", data);
        }
        // ========================================================

        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        const errorMessage =
          data.message ||
          data.error ||
          "Falha no login. Verifique suas credenciais. ";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao conectar com o servidor.");
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
            <div className="email-row">
              <input
                type="text"
                placeholder="Email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

            <div className="login-links">
              <Link to="/esqueceu-senha" className="login-forgot">
                Esqueceu a Senha?
              </Link>
            </div>

            <button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
