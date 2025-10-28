import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="home-header">
      <Link to="/" className="home-logo" style={{ textDecoration: "none" }}>
        UniLivros
      </Link>
      <div>
        <Link to="/cadastro">
          <button className="btn-cadastro">Cadastre-se</button>
        </Link>
        <Link to="/login">
          <button className="btn-login">Login</button>
        </Link>
      </div>
    </header>
  );
}
