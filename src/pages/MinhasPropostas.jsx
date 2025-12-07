import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import TradeCard from "../components/TradeCard";
import { API_BASE_URL } from "../services/api";
import "./MinhasPropostas.css";

export default function MinhasPropostas() {
  const [activeTab, setActiveTab] = useState("recebidas");
  const [propostas, setPropostas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const openModal = (proposta) => setSelectedProposal(proposta);
  const closeModal = () => setSelectedProposal(null);

  useEffect(() => {
    async function fetchPropostas() {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const endpoint =
          activeTab === "recebidas"
            ? "/propostas/recebidas"
            : "/propostas/enviadas";

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar propostas");

        const backendData = await response.json();
        
        console.log("📥 Propostas do backend:", backendData);

        const processedPropostas = await Promise.all(
          backendData.map(async (p) => {
            const fetchImage = async (query) => {
              try {
                const res = await fetch(
                  `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                    query
                  )}&maxResults=1`
                );
                const data = await res.json();
                return (
                  data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || 
                  "https://via.placeholder.com/80x120?text=Sem+Capa"
                );
              } catch {
                return "https://via.placeholder.com/80x120?text=Sem+Capa";
              }
            };

            const imgOferecido = await fetchImage(p.livroOferecidoTitulo || "Livro");
            const imgDesejado = await fetchImage(p.livroDesejadoTitulo || "Livro");

            return {
              id: p.id, // ✅ ID real do banco de dados
              livroOferecido: {
                title: p.livroOferecidoTitulo || "Título não disponível",
                img: imgOferecido,
              },
              livroDesejado: { 
                title: p.livroDesejadoTitulo || "Título não disponível", 
                img: imgDesejado 
              },
              usuario: p.nomeUsuarioRelacionado || "Usuário desconhecido",
              status: p.status || "PENDENTE",
              dataTroca: p.dataTroca || "Não informada",
              local: p.local || "Não informado",
            };
          })
        );

        console.log("✅ Propostas processadas:", processedPropostas);
        setPropostas(processedPropostas);
      } catch (error) {
        console.error("❌ Erro:", error);
        toast.error("Erro ao carregar propostas.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPropostas();
  }, [activeTab]);

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/propostas/${selectedProposal.id}/aceitar`,
        {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response.ok) {
        toast.success("Proposta aceita com sucesso!");
        setPropostas((prev) =>
          prev.filter((p) => p.id !== selectedProposal.id)
        );
        closeModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData. message || "Erro ao aceitar proposta.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast. error("Erro de conexão.");
    }
  };

  const handleDecline = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/propostas/${selectedProposal.id}/rejeitar`,
        {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response. ok) {
        toast.info("Proposta recusada.");
        setPropostas((prev) =>
          prev.filter((p) => p.id !== selectedProposal.id)
        );
        closeModal();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao recusar proposta.");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro de conexão.");
    }
  };

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

        {isLoading ? (
          <p>Carregando propostas...</p>
        ) : (
          <div className="propostas-list">
            {propostas.length === 0 && <p>Nenhuma proposta encontrada.</p>}
            {propostas.map((proposta) => (
              <TradeCard
                key={proposta. id}
                trade={{
                  livroRecebido:
                    activeTab === "recebidas"
                      ? proposta.livroOferecido
                      : proposta.livroDesejado,
                  livroDado:
                    activeTab === "recebidas"
                      ?  proposta.livroDesejado
                      : proposta.livroOferecido,
                  status: proposta.status,
                }}
                onClick={() => openModal(proposta)}
              />
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={!! selectedProposal} onClose={closeModal}>
        {selectedProposal && (
          <div className="proposta-modal-content">
            <h2 className="proposta-modal-title">Detalhes da Proposta</h2>

            <div className="proposta-modal-section">
              <p>
                <strong>Livro Oferecido:</strong>{" "}
                {selectedProposal.livroOferecido.title}
              </p>
              <p>
                <strong>Livro Desejado:</strong>{" "}
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
                <strong>Data Sugerida:</strong> {selectedProposal.dataTroca}
              </p>
              <p>
                <strong>Local Sugerido:</strong> {selectedProposal.local}
              </p>
              <p>
                <strong>Status:</strong> {selectedProposal.status}
              </p>
            </div>

            {activeTab === "recebidas" &&
              selectedProposal.status === "PENDENTE" && (
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