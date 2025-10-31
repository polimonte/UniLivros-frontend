import React, { useState } from "react";
import Header from "../components/Header";
import "./Forms.css"; // <-- Importa o CSS centralizado
import "./Login.css"; // <-- Importa o CSS específico de Login
import bookIcon from "../assets/book-icon.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // <-- Estado para senha

  // --- Função de Envio ---
  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    if (!email || !password) {
      alert("Por favor, preencha o usuário e a senha.");
      return;
    }

    console.log("--- Dados do Login ---");
    console.log("Usuário:", email);
    console.log("Senha:", password);
    alert("Login simulado com sucesso! Verifique o console (F12).");
  };

  return (
    // Classes renomeadas para 'form-'
    <div className="form-bg">
      <Header />
      <main className="form-main">
        <section className="form-card">
          <img src={bookIcon} alt="Ícone de livro" className="form-icon" />

          {/* Adiciona o 'onSubmit' */}
          <form className="form-form" onSubmit={handleSubmit}>
            <div className="email-row">
              <input
                type="text"
                placeholder="Email"
                className="form-input" // Classe 'form-input'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>
            <input
              type="password"
              placeholder="Senha"
              className="form-input" // Classe 'form-input'
              value={password} // <-- Controla o valor
              onChange={(e) => setPassword(e.target.value)} // <-- Atualiza o estado
              autoComplete="current-password"
            />
            {/* Estes links são únicos do Login, por isso mantêm as classes originais */}
            <div className="login-links">
              <a href="#" className="login-forgot">
                Esqueceu a Senha?
              </a>
            </div>
            <button type="submit" className="form-btn">
              {" "}
              {/* Classe 'form-btn' */}
              Entrar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
