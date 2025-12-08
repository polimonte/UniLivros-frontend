import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import { API_BASE_URL } from "../services/api";
import "./MinhasTrocas.css";

export default function MinhasTrocas() {
  const [trocas, setTrocas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTroca, setSelectedTroca] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");

  useEffect(() => {
    carregarTrocas();
  }, []);

  const carregarTrocas = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/trocas/minhas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📦 Trocas recebidas:", data);
        setTrocas(data);
      } else {
        toast.error("Erro ao carregar trocas");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão");
    } finally {
      setIsLoading(false);
    }
  };

  const gerarQRCode = async (trocaId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/trocas/${trocaId}/gerar-qr`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("📱 QR Code gerado:", data);
        setQrCodeImage(data.qrCodeBase64);
        setSelectedTroca(data);
        setShowQRModal(true);
        carregarTrocas();
      } else {
        toast.error("Erro ao gerar QR Code");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão");
    }
  };

  const validarQRCode = async () => {
    if (!qrCodeInput.trim()) {
      toast.error("Digite o código QR");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/trocas/validar-qrcode?qrCode=${encodeURIComponent(
          qrCodeInput
        )}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const troca = await response.json();
        toast.success("Troca concluída com sucesso!");
        setShowValidateModal(false);
        setQrCodeInput("");
        carregarTrocas();
      } else {
        const error = await response.json();
        toast.error(error.message || "QR Code inválido");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão");
    }
  };

  const cancelarTroca = async (trocaId) => {
    if (!window.confirm("Tem certeza que deseja cancelar esta troca?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/trocas/${trocaId}/cancelar`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        toast.info("Troca cancelada");
        setSelectedTroca(null);
        carregarTrocas();
      } else {
        toast.error("Erro ao cancelar troca");
      }
    } catch (error) {
      toast.error("Erro de conexão");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informada";
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDENTE: "#FFA500",
      CONFIRMADA: "#4CAF50",
      CONCLUIDA: "#2196F3",
      CANCELADA: "#F44336",
    };
    return colors[status] || "#999";
  };

  const getStatusText = (status) => {
    const texts = {
      PENDENTE: "Aguardando Confirmação",
      CONFIRMADA: "Confirmada",
      CONCLUIDA: "Concluída",
      CANCELADA: "Cancelada",
    };
    return texts[status] || status;
  };

  return (
    <>
      <main className="trocas-main">
        <h1 className="trocas-title">Minhas Trocas</h1>

        <button
          className="btn-validar-qr-top"
          onClick={() => setShowValidateModal(true)}
        >
          📱 Validar QR Code e Concluir Troca
        </button>

        {isLoading ? (
          <p className="loading-text">Carregando...</p>
        ) : (
          <div className="trocas-list">
            {trocas.length === 0 && (
              <div className="empty-state">
                <p>📭 Nenhuma troca encontrada.</p>
                <p className="empty-subtitle">
                  As trocas aparecem aqui quando você aceita uma proposta.
                </p>
              </div>
            )}
            {trocas.map((troca) => (
              <div
                key={troca.id}
                className="troca-card"
                onClick={() => setSelectedTroca(troca)}
              >
                <div className="troca-header">
                  <h3>🔄 Troca #{troca.id}</h3>
                  <span
                    className="troca-status"
                    style={{ backgroundColor: getStatusColor(troca.status) }}
                  >
                    {getStatusText(troca.status)}
                  </span>
                </div>
                <div className="troca-info">
                  <p>
                    <strong>📅 Criada em:</strong> {formatDate(troca.createdAt)}
                  </p>
                  {troca.dataHora && (
                    <p>
                      <strong>🕐 Data sugerida:</strong>{" "}
                      {formatDate(troca.dataHora)}
                    </p>
                  )}
                  {troca.dataConfirmacao && (
                    <p>
                      <strong>✅ Concluída em:</strong>{" "}
                      {formatDate(troca.dataConfirmacao)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={!!selectedTroca && !showQRModal}
        onClose={() => setSelectedTroca(null)}
      >
        {selectedTroca && (
          <div className="troca-modal-content">
            <h2>🔄 Detalhes da Troca #{selectedTroca.id}</h2>

            <div className="troca-modal-section">
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: getStatusColor(selectedTroca.status) }}>
                  {getStatusText(selectedTroca.status)}
                </span>
              </p>
              <p>
                <strong>Criada em:</strong>{" "}
                {formatDate(selectedTroca.createdAt)}
              </p>
              {selectedTroca.dataHora && (
                <p>
                  <strong>Data Sugerida:</strong>{" "}
                  {formatDate(selectedTroca.dataHora)}
                </p>
              )}
              {selectedTroca.local && (
                <p>
                  <strong>Local:</strong> {selectedTroca.local}
                </p>
              )}
              {selectedTroca.observacoes && (
                <p>
                  <strong>Observações:</strong> {selectedTroca.observacoes}
                </p>
              )}
              {selectedTroca.dataConfirmacao && (
                <p>
                  <strong>Concluída em:</strong>{" "}
                  {formatDate(selectedTroca.dataConfirmacao)}
                </p>
              )}
            </div>

            <div className="troca-modal-actions">
              {selectedTroca.status === "PENDENTE" && (
                <>
                  <button
                    className="btn-cancelar-troca"
                    onClick={() => cancelarTroca(selectedTroca.id)}
                  >
                    ❌ Cancelar Troca
                  </button>
                  <button
                    className="btn-gerar-qrcode"
                    onClick={() => {
                      setSelectedTroca(null);
                      gerarQRCode(selectedTroca.id);
                    }}
                  >
                    📱 Gerar QR Code
                  </button>
                </>
              )}

              {selectedTroca.status === "PENDENTE" && selectedTroca.qrCode && (
                <button
                  className="btn-ver-qrcode"
                  onClick={() => {
                    gerarQRCode(selectedTroca.id);
                  }}
                >
                  👁️ Ver QR Code
                </button>
              )}
            </div>

            <button
              className="troca-modal-close-btn"
              onClick={() => setSelectedTroca(null)}
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      {/* Modal do QR Code */}
      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)}>
        <div className="qrcode-modal-content">
          <h2>📱 QR Code da Troca</h2>
          {qrCodeImage && (
            <>
              <div className="qrcode-container">
                <img
                  src={`data:image/png;base64,${qrCodeImage}`}
                  alt="QR Code"
                  className="qrcode-image"
                />
              </div>
              <p className="qrcode-info">
                Apresente este QR Code no momento da troca para concluí-la
              </p>
              {selectedTroca?.qrCode && (
                <div className="qrcode-text-container">
                  <p className="qrcode-label">Código:</p>
                  <p className="qrcode-text">{selectedTroca.qrCode}</p>
                  <button
                    className="btn-copy-code"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedTroca.qrCode);
                      toast.success("Código copiado!");
                    }}
                  >
                    📋 Copiar Código
                  </button>
                </div>
              )}
            </>
          )}
          <button
            className="troca-modal-close-btn"
            onClick={() => setShowQRModal(false)}
          >
            Fechar
          </button>
        </div>
      </Modal>

      {/* Modal de Validação */}
      <Modal
        isOpen={showValidateModal}
        onClose={() => setShowValidateModal(false)}
      >
        <div className="validate-modal-content">
          <h2>📱 Validar QR Code</h2>
          <p className="validate-description">
            Digite ou cole o código QR da troca para concluí-la:
          </p>
          <input
            type="text"
            className="qr-input"
            placeholder="TROCA:xxxx-xxxx-xxxx-xxxx"
            value={qrCodeInput}
            onChange={(e) => setQrCodeInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                validarQRCode();
              }
            }}
          />
          <div className="validate-actions">
            <button
              className="btn-cancelar"
              onClick={() => {
                setShowValidateModal(false);
                setQrCodeInput("");
              }}
            >
              Cancelar
            </button>
            <button className="btn-validar" onClick={validarQRCode}>
              ✅ Validar e Concluir
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
