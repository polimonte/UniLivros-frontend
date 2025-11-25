import React, { useState, useEffect } from "react";
import Modal from "../components/Modal";
import TradeCard from "../components/TradeCard";
import { API_BASE_URL } from "../services/api";
import "./MinhasTrocas.css";

export default function MinhasTrocas() {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);

  const openModal = (trade) => setSelectedTrade(trade);
  const closeModal = () => setSelectedTrade(null);

  useEffect(() => {
    async function fetchTrades() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Usuário não autenticado.");
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/trocas`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Falha ao carregar trocas.");

        const backendData = await response.json();

        const processedTrades = await Promise.all(
          backendData.map(async (trade) => {
            const fetchImage = async (query) => {
              try {
                const res = await fetch(
                  `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                    query
                  )}&maxResults=1`
                );
                const data = await res.json();
                return (
                  data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail || null
                );
              } catch {
                return null;
              }
            };

            const imgRecebido = await fetchImage(trade.livroRecebidoTitulo);
            const imgDado = await fetchImage(trade.livroDadoTitulo);

            return {
              id: trade.id,
              livroRecebido: {
                title: trade.livroRecebidoTitulo,
                img: imgRecebido,
              },
              livroDado: {
                title: trade.livroDadoTitulo,
                img: imgDado,
              },
              comQuem: trade.nomeOutroUsuario,
              status: trade.status,
              dataAtualizacao: trade.dataAtualizacao || "N/A",
              avaliacao: trade.avaliacao,
              comentario: trade.comentario,
              local: trade.local,
              dataHora: trade.dataHora,
              observacoes: trade.observacoes,
            };
          })
        );

        setTrades(processedTrades);
      } catch (err) {
        setError("Erro ao carregar histórico de trocas.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTrades();
  }, []);

  return (
    <>
      <main className="trocas-main">
        <h1 className="trocas-title">Minhas Trocas</h1>
        <h2 className="trocas-subtitle">Seu histórico de trocas</h2>

        {isLoading && <p>Carregando histórico...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!isLoading && !error && trades.length === 0 && (
          <p>Nenhuma troca realizada ainda.</p>
        )}

        <div className="trocas-list">
          {trades.map((trade) => (
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
                  <strong>Nota:</strong>{" "}
                  {selectedTrade.avaliacao
                    ? "★".repeat(selectedTrade.avaliacao)
                    : "Não avaliado"}
                </p>
                {selectedTrade.comentario && (
                  <p>
                    <strong>Comentário:</strong> "{selectedTrade.comentario}"
                  </p>
                )}
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
