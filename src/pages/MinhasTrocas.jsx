import React, { useState } from "react";
import Modal from "../components/Modal";
import TradeCard from "../components/TradeCard";
import "./MinhasTrocas.css";

import carasCoracoesImg from "../assets/books/caras-coracoes.jpg";
import quemEAlascaImg from "../assets/books/caras-coracoes.jpg";
import maoELuvaImg from "../assets/books/caras-coracoes.jpg";
import harryPotterImg from "../assets/books/caras-coracoes.jpg";

const mockTrades = [
  {
    id: 1,
    livroRecebido: { title: "Caras e Corações", img: carasCoracoesImg },
    livroDado: { title: "Quem é você Alasca?", img: quemEAlascaImg },
    comQuem: "Jonatas Lopes",
    status: "Concluída",
    dataAtualizacao: "10/11/2025",
    avaliacao: 5,
    comentario: "Troca tranquila, livro em ótimo estado!",
    local: "Pátio da Biblioteca Central",
    dataHora: "08/11/2025 às 15:30",
    observacoes: "Levar o livro em uma sacola.",
  },
  {
    id: 2,
    livroRecebido: { title: "A Mão e a Luva", img: maoELuvaImg },
    livroDado: { title: "Harry Potter", img: harryPotterImg },
    comQuem: "Maria Clara",
    status: "Pendente",
    dataAtualizacao: "14/11/2025",
    avaliacao: null,
    comentario: null,
    local: "Entrada do Bloco A",
    dataHora: "16/11/2025 às 10:00",
    observacoes: "Confirmar um dia antes.",
  },
];

export default function MinhasTrocas() {
  const [selectedTrade, setSelectedTrade] = useState(null);

  const openModal = (trade) => setSelectedTrade(trade);
  const closeModal = () => setSelectedTrade(null);

  return (
    <>
      <main className="trocas-main">
        <h1 className="trocas-title">Minhas Trocas</h1>
        <h2 className="trocas-subtitle">Seu histórico de trocas</h2>

        <div className="trocas-list">
          {mockTrades.map((trade) => (
            <TradeCard
              key={trade.id}
              trade={trade}
              onClick={() => openModal(trade)}
            />
          ))}
        </div>
      </main>

      <Modal isOpen={!!selectedTrade} onClose={closeModal}>
        {selectedTrade && (
          <div className="trade-modal-content">
            <h2 className="trade-modal-title">Detalhes da Troca</h2>

            <div className="trade-modal-section">
              <h3 className="trade-modal-subtitle">Livros</h3>
              <p>
                <strong>Recebido:</strong> {selectedTrade.livroRecebido.title}
              </p>
              <p>
                <strong>Dado:</strong> {selectedTrade.livroDado.title}
              </p>
            </div>

            <div className="trade-modal-section">
              <h3 className="trade-modal-subtitle">Informações</h3>
              <p>
                <strong>Troca com:</strong> {selectedTrade.comQuem}
              </p>
              <p>
                <strong>Status:</strong> {selectedTrade.status}
              </p>
              <p>
                <strong>Última atualização:</strong>{" "}
                {selectedTrade.dataAtualizacao}
              </p>
            </div>

            <div className="trade-modal-section">
              <h3 className="trade-modal-subtitle">Encontro</h3>
              <p>
                <strong>Local:</strong> {selectedTrade.local}
              </p>
              <p>
                <strong>Data e Hora:</strong> {selectedTrade.dataHora}
              </p>
              {selectedTrade.observacoes && (
                <p>
                  <strong>Obs:</strong> {selectedTrade.observacoes}
                </p>
              )}
            </div>

            {selectedTrade.status === "Concluída" && (
              <div className="trade-modal-section">
                <h3 className="trade-modal-subtitle">Avaliação</h3>
                <p>
                  <strong>Nota:</strong> {"★".repeat(selectedTrade.avaliacao)}
                  {"☆".repeat(5 - selectedTrade.avaliacao)}
                </p>
                <p>
                  <strong>Comentário:</strong> "{selectedTrade.comentario}"
                </p>
              </div>
            )}

            <button className="trade-modal-close-btn" onClick={closeModal}>
              Fechar
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
