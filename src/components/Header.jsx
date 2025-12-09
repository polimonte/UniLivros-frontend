import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-logo">
        <Link to="/" className="logo-text">
          UniLivros
        </Link>
      </div>
      <nav className="header-nav">
        <Link to="/cadastro" className="header-btn primary">
          Cadastre-se
        </Link>
        <Link to="/login" className="header-btn secondary">
          Login
        </Link>
      </nav>
    </header>
  );
}
