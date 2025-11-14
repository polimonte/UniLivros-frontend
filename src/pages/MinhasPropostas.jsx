import React, { useState } from "react";
import Modal from "../components/Modal";
import TradeCard from "../components/TradeCard";
import "./MinhasPropostas.css";

import carasCoracoesImg from "../assets/books/caras-coracoes.jpg";
import quemEAlascaImg from "../assets/books/memorias-postumas.jpg";
import maoELuvaImg from "../assets/books/memorias-postumas.jpg";
import harryPotterImg from "../assets/books/harry-potter.jpg";
import memoriasPostumasImg from "../assets/books/memorias-postumas.jpg";

const mockPropostasRecebidas = [
  {
    id: 1,
    livroDesejado: { title: "Quem é você Alasca?", img: quemEAlascaImg },
    livroOferecido: { title: "Caras e Corações", img: carasCoracoesImg },
    usuario: "Jonatas Lopes",
    status: "Pendente",
    dataTroca: "18/11/2025",
    local: "Pátio da Biblioteca",
  },
  {
    id: 2,
    livroDesejado: { title: "Harry Potter", img: harryPotterImg },
    livroOferecido: { title: "A Mão e a Luva", img: maoELuvaImg },
    usuario: "Maria Clara",
    status: "Pendente",
    dataTroca: "19/11/2025",
    local: "Entrada Bloco A",
  },
];

const mockPropostasEnviadas = [
  {
    id: 3,
    livroDesejado: { title: "Memórias Póstumas", img: memoriasPostumasImg },
    livroOferecido: { title: "Harry Potter", img: harryPotterImg },
    usuario: "Carlos André",
    status: "Pendente",
    dataTroca: "20/11/2025",
    local: "Cantina",
  },
];

export default function MinhasPropostas() {
  const [activeTab, setActiveTab] = useState("recebidas");
  const [selectedProposal, setSelectedProposal] = useState(null);

  const openModal = (proposta) => setSelectedProposal(proposta);
  const closeModal = () => setSelectedProposal(null);

  const handleAccept = () => {
    console.log("Proposta Aceita:", selectedProposal.id);
    closeModal();
  };

  const handleDecline = () => {
    console.log("Proposta Recusada:", selectedProposal.id);
    closeModal();
  };

  const propostasParaMostrar =
    activeTab === "recebidas" ? mockPropostasRecebidas : mockPropostasEnviadas;

  return (
    <>
      <main className="propostas-main">
        <h1 className="propostas-title">Minhas Propostas</h1>

        <div className="propostas-tabs">
          <button
            className={`propostas-tab-btn ${
              activeTab === "recebidas" ? "active" : ""
            }`}
            onClick={() => setActiveTab("recebidas")}
          >
            Recebidas
          </button>
          <button
            className={`propostas-tab-btn ${
              activeTab === "enviadas" ? "active" : ""
            }`}
            onClick={() => setActiveTab("enviadas")}
          >
            Enviadas
          </button>
        </div>

        <div className="propostas-list">
          {propostasParaMostrar.map((proposta) => (
            <TradeCard
              key={proposta.id}
              trade={{
                livroRecebido: proposta.livroDesejado,
                livroDado: proposta.livroOferecido,
                status: proposta.status,
              }}
              onClick={() => openModal(proposta)}
            />
          ))}
        </div>
      </main>

      <Modal isOpen={!!selectedProposal} onClose={closeModal}>
        {selectedProposal && (
          <div className="proposta-modal-content">
            <h2 className="proposta-modal-title">Detalhes da Proposta</h2>

            <div className="proposta-modal-section">
              <p>
                <strong>
                  {activeTab === "recebidas"
                    ? "Livro Oferecido (por você):"
                    : "Livro Oferecido (por você):"}
                </strong>{" "}
                {selectedProposal.livroOferecido.title}
              </p>
              <p>
                <strong>
                  {activeTab === "recebidas"
                    ? "Livro Desejado (dele/a):"
                    : "Livro Desejado (por você):"}
                </strong>{" "}
                {selectedProposal.livroDesejado.title}
              </p>
            </div>

            <div className="proposta-modal-section">
              <p>
                <strong>
                  {activeTab === "recebidas"
                    ? "Usuário (enviou):"
                    : "Usuário (recebeu):"}
                </strong>{" "}
                {selectedProposal.usuario}
              </p>
              <p>
                <strong>Data da Troca:</strong> {selectedProposal.dataTroca}
              </p>
              <p>
                <strong>Local da Troca:</strong> {selectedProposal.local}
              </p>
              <p>
                <strong>Status:</strong> {selectedProposal.status}
              </p>
            </div>

            {activeTab === "recebidas" &&
              selectedProposal.status === "Pendente" && (
                <div className="proposta-modal-actions">
                  <button className="btn-recusar" onClick={handleDecline}>
                    Recusar Proposta
                  </button>
                  <button className="btn-aceitar" onClick={handleAccept}>
                    Aceitar Proposta
                  </button>
                </div>
              )}

            <button className="proposta-modal-close-btn" onClick={closeModal}>
              Fechar
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
