import React from "react";
import NotificationCard from "../components/NotificationCard";
import "./Notificacoes.css";

export default function Notificacoes() {
  return (
    <main className="notificacoes-main">
      <h1 className="notificacoes-title">Notificações</h1>
      <h2 className="notificacoes-subtitle">Recentes</h2>

      <div className="notificacoes-list">
        <NotificationCard
          title="Sua troca foi aceita!"
          text="Parabéns! Sua troca com @jonataslopes foi aceita e o livro 'Caras e Corações' está a caminho."
          buttonText="Ver troca"
          buttonLink="/minhas-trocas"
        />
        <NotificationCard
          title="Nova proposta de troca!"
          text="@maria enviou uma proposta para o seu livro 'O Mágico de Oz'."
          buttonText="Ver proposta"
          buttonLink="#"
        />
        <NotificationCard
          title="Troca Concluída"
          text="Não se esqueça de avaliar sua troca com @carlos."
          buttonText="Avaliar"
          buttonLink="#"
        />
      </div>
    </main>
  );
}
