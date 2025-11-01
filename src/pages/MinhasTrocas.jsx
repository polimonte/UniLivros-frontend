import React from "react";
import BookCard from "../components/BookCard";
import BookPlaceholderCard from "../components/BookPlaceholderCard";
import "./MinhasTrocas.css";

import carasCoracoesImg from "../assets/books/caras-coracoes.jpg";
import quemEAlascaImg from "../assets/books/caras-coracoes.jpg";
import maoELuvaImg from "../assets/books/caras-coracoes.jpg";

export default function MinhasTrocas() {
  return (
    <main className="trocas-main">
      <h1 className="trocas-title">Minhas Trocas</h1>
      <h2 className="trocas-subtitle">Recentes</h2>

      <div className="book-grid">
        <BookCard
          id="caras-e-coracoes"
          imgSrc={carasCoracoesImg}
          title="Caras e Corações"
          author="Thomas Lopes"
          year="1910"
          buttonText="Ver troca"
          buttonStyle="default"
        />
        <BookCard
          id="quem-e-alasca"
          imgSrc={quemEAlascaImg}
          title="Quem é você Alasca?"
          author="John Green"
          year="2005"
          buttonText="Ver troca"
          buttonStyle="default"
        />
        <BookCard
          id="mao-e-luva"
          imgSrc={maoELuvaImg}
          title="A Mão e a Luva"
          author="Machado de Assis"
          year="1874"
          buttonText="Ver troca"
          buttonStyle="default"
        />
        <BookCard
          id="nome-livro"
          imgSrc={null}
          title="Nome do Livro"
          author="Ana da Silva"
          year=""
          buttonText="Ver troca"
          buttonStyle="disabled"
        />
        <BookPlaceholderCard />
        <BookPlaceholderCard />
        <BookPlaceholderCard />
        <BookPlaceholderCard />
      </div>
    </main>
  );
}
