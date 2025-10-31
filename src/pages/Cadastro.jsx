import React, { useState } from "react";
import Header from "../components/Header";
import "./Forms.css"; // <-- Importa APENAS o CSS centralizado
import bookIcon from "../assets/book-icon.jpg";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // <-- Estado para nome
  const [matricula, setMatricula] = useState(""); // <-- Estado para matricula
  const [password, setPassword] = useState(""); // <-- Estado para senha
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- Estado para confirmar senha

  // --- Função de Envio ---
  const handleSubmit = (event) => {
    event.preventDefault(); // Impede o recarregamento

    if (!name || !email || !matricula || !password || !confirmPassword) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      alert("As senhas não conferem!");
      return;
    }

    console.log("--- Dados do Cadastro ---");
    console.log("Nome:", name);
    console.log("Usuário:", email);
    console.log("Matrícula:", matricula);
    console.log("Senha:", password);
    alert("Cadastro simulado com sucesso! Verifique o console (F12).");
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
            <input
              type="text"
              placeholder="Nome"
              className="form-input" // Classe 'form-input'
              value={name} // <-- Controla o valor
              onChange={(e) => setName(e.target.value)} // <-- Atualiza o estado
              autoComplete="name"
            />
            <div className="email-row">
              <input
                type="text"
                placeholder="Usuário"
                className="form-input" // Classe 'form-input'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <span className="email-domain">@souunit.com.br</span>
            </div>
            <input
              type="text"
              placeholder="Matrícula"
              className="form-input" // Classe 'form-input'
              value={matricula} // <-- Controla o valor
              onChange={(e) => setMatricula(e.target.value)} // <-- Atualiza o estado
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Senha"
              className="form-input" // Classe 'form-input'
              value={password} // <-- Controla o valor
              onChange={(e) => setPassword(e.target.value)} // <-- Atualiza o estado
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirmação de senha"
              className="form-input" // Classe 'form-input'
              value={confirmPassword} // <-- Controla o valor
              onChange={(e) => setConfirmPassword(e.target.value)} // <-- Atualiza o estado
              autoComplete="new-password"
            />
            <button type="submit" className="form-btn">
              {" "}
              {/* Classe 'form-btn' */}
              Cadastrar
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
