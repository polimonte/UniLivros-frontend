import React, { useState } from "react";
import { useParams } from "react-router-dom";
import UserCard from "../components/UserCard";
import "./LivroDetalhes.css";

import bookCoverImg from "../assets/books/caras-coracoes.jpg";
import userAvatarImg from "../assets/avatar-jonatas.jpeg";

export default function LivroDetalhes() {
  const { id } = useParams();
  const [isSolicitado, setSolicitado] = useState(false);

  const handleClickSolicitar = () => {
    setSolicitado(true);
  };

  return (
    <main className="detalhes-main">
      <div className="detalhes-coluna-esquerda">
        <section className="detalhes-info-livro">
          <h1 className="detalhes-titulo">CARAS E CORAÇÕES</h1>
          <h2 className="detalhes-autor">Thomaz Lopes 1910</h2>
          <div className="detalhes-tags">
            <span>
              <strong>Categoria:</strong> Drama
            </span>
            <span>
              <strong>Tipo:</strong> Troca
            </span>
            <span>
              <strong>Estado:</strong> Semi-Novo
            </span>
          </div>
        </section>

        <UserCard
          name="Jonatas Lopes"
          rating="4.8"
          tradeCount="6"
          avatarImg={userAvatarImg}
        />

        <section className="detalhes-sinopse">
          <p>
            Se você já amou, se perdeu e se reencontrou, esse livro vai te
            abraçar nas entrelinhas.
          </p>
          <p>
            Caras e Corações, de Thomaz Lopes, foi uma leitura que me prendeu do
            início ao fim. O autor tem uma forma leve e profunda de mostrar como
            sentimentos e escolhas moldam quem somos.
          </p>
          <p>
            O livro está em ótimo estado (semi-novo), sem anotações nem páginas
            amassadas — apenas com aquelas boas vibrações de quem realmente
            aproveitou a história.
          </p>
          <p>
            Essa obra me fez refletir sobre amizade, amor e autoconhecimento de
            um jeito que poucas leituras conseguem. Agora quero que ele siga
            viagem e toque outro coração como tocou o meu.
          </p>
        </section>

        <section className="detalhes-avaliacao">
          <h3>Avaliação</h3>
          <div className="estrelas">
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9734;</span>
          </div>
        </section>
      </div>

      <div className="detalhes-coluna-direita">
        <img
          src={bookCoverImg}
          alt="Capa do livro Caras e Corações"
          className="detalhes-capa"
        />
        <button className="btn-ver-imagem">Ver Imagem</button>
        <button
          className={`btn-solicitar ${isSolicitado ? "solicitado" : ""}`}
          onClick={handleClickSolicitar}
          disabled={isSolicitado}
        >
          {isSolicitado ? "Troca solicitada" : "Solicitar Troca"}
        </button>
      </div>
    </main>
  );
}
