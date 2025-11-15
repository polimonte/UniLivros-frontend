import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PerfilHeader from "../components/PerfilHeader";
import BookCard from "../components/BookCard";
import AvaliacaoCard from "../components/AvaliacaoCard";
import ConquistaCard from "../components/ConquistaCard";
import "./Perfil.css";

import avatarImg from "../assets/avatar-jonatas.jpeg";
import memoriasPostumasImg from "../assets/books/memorias-postumas.jpg";
import carasCoracoesImg from "../assets/books/caras-coracoes.jpg";
import quemEAlascaImg from "../assets/books/memorias-postumas.jpg";
import maoELuvaImg from "../assets/books/memorias-postumas.jpg";

export default function Perfil() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("estante");

  const userData = {
    name: "Jonatas Lopes",
    avatar: avatarImg,
    curso: "Psicologia",
    rating: 4.8,
    tradeCount: 6,
    conquistaCount: 2,
    livrosDisponiveis: 4,
  };

  return (
    <main className="perfil-main">
      <PerfilHeader
        user={userData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "estante" && (
        <section className="perfil-estante">
          <div className="book-grid">
            <BookCard
              id="memorias-postumas"
              imgSrc={memoriasPostumasImg}
              title="Memórias Póstumas"
              author="Machado de Assis"
              year="1881"
            />
            <BookCard
              id="caras-e-coracoes"
              imgSrc={carasCoracoesImg}
              title="Caras e Corações"
              author="Thomas Lopes"
              year="1990"
            />
            <BookCard
              id="quem-e-alasca"
              imgSrc={quemEAlascaImg}
              title="Quem é você Alasca?"
              author="John Green"
              year="2005"
            />
            <BookCard
              id="mao-e-luva"
              imgSrc={maoELuvaImg}
              title="A Mão e a Luva"
              author="Machado de Assis"
              year="1874"
            />
          </div>
        </section>
      )}

      {activeTab === "avaliacoes" && (
        <section className="perfil-avaliacoes">
          <AvaliacaoCard
            title="Livros em ótimo estado!!!"
            text="Nos encontramos para fazer a troca, e foi tudo tranquilo cumpriu com o horario e o estado do livro coincidiu com oque havia descrito"
          />
          <AvaliacaoCard
            title="Livros em ótimo estado!!!"
            text="Nos encontramos para fazer a troca, e foi tudo tranquilo cumpriu com o horario e o estado do livro coincidiu com oque havia descrito"
          />
        </section>
      )}

      {activeTab === "conquistas" && (
        <section className="perfil-conquistas">
          <ConquistaCard
            iconType="confiavel"
            title="Super Confiável!!"
            text="Você Recebeu 15 avaliações 5 estrelas em relação a veracidade no estado dos livros"
            exp="25"
          />
          <ConquistaCard
            iconType="engajado"
            title="Engajado!!"
            text="Você Trocou 5 livros"
            exp="10"
          />
        </section>
      )}
    </main>
  );
}
