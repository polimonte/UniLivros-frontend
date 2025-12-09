import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import TradeCard from "../components/TradeCard";
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

        // Processar trocas com imagens do Google Books
        const trocasProcessadas = await Promise.all(
          data.map(async (troca) => {
            const fetchImage = async (titulo) => {
              try {
                const res = await fetch(
                  `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                    titulo
                  )}&maxResults=1`
                );
                const googleData = await res.json();
                return (
                  googleData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail ||
                  "https://via.placeholder.com/80x120?text=Sem+Capa"
                );
              } catch {
                return "https://via.placeholder.com/80x120?text=Sem+Capa";
              }
            };

            const imgLivro1 = troca.livro1Titulo
              ? await fetchImage(troca.livro1Titulo)
              : null;
            const imgLivro2 = troca.livro2Titulo
              ? await fetchImage(troca.livro2Titulo)
              : null;

            return {
              ...troca,
              livro1Img: imgLivro1,
              livro2Img: imgLivro2,
            };
          })
        );

        setTrocas(trocasProcessadas);
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
        setSelectedTroca({ ...selectedTroca, qrCode: data.qrCode });
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
    try {
      return new Date(dateString).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data inválida";
    }
  };

  return (
    <>
      <main className="trocas-main">
        <h1 className="trocas-title">Minhas Trocas</h1>
        <h2 className="trocas-subtitle">
          Gerencie suas trocas confirmadas e em andamento
        </h2>

        <button
          className="btn-validar-qr-top"
          onClick={() => setShowValidateModal(true)}
        >
          📱 Validar QR Code e Concluir Troca
        </button>

        {isLoading ? (
          <p>Carregando trocas...</p>
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
              <TradeCard
                key={troca.id}
                trade={{
                  livroRecebido: {
                    title: troca.livro1Titulo || "Livro 1",
                    img: troca.livro1Img,
                  },
                  livroDado: {
                    title: troca.livro2Titulo || "Livro 2",
                    img: troca.livro2Img,
                  },
                  status: troca.status || "PENDENTE",
                }}
                onClick={() => setSelectedTroca(troca)}
              />
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
          <div>
            <h2 className="troca-modal-title">
              Detalhes da Troca #{selectedTroca.id}
            </h2>

            <div className="troca-modal-section">
              <p>
                <strong>Livro 1:</strong> {selectedTroca.livro1Titulo}
              </p>
              <p>
                <strong>Livro 2:</strong> {selectedTroca.livro2Titulo}
              </p>
            </div>

            <div className="troca-modal-section">
              <p>
                <strong>Status:</strong>{" "}
                {selectedTroca.status === "PENDENTE"
                  ? "Aguardando Confirmação"
                  : selectedTroca.status === "CONFIRMADA"
                  ? "Confirmada"
                  : selectedTroca.status === "CONCLUIDA"
                  ? "Concluída"
                  : selectedTroca.status}
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

            {selectedTroca.status === "PENDENTE" && (
              <div className="troca-modal-actions">
                <button
                  className="btn-cancelar-troca"
                  onClick={() => cancelarTroca(selectedTroca.id)}
                >
                  Cancelar Troca
                </button>
                {selectedTroca.qrCode ? (
                  <button
                    className="btn-ver-qrcode"
                    onClick={() => {
                      setQrCodeImage(selectedTroca.qrCodeBase64 || "");
                      setShowQRModal(true);
                    }}
                  >
                    Ver QR Code
                  </button>
                ) : (
                  <button
                    className="btn-gerar-qrcode"
                    onClick={() => gerarQRCode(selectedTroca.id)}
                  >
                    Gerar QR Code
                  </button>
                )}
              </div>
            )}

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
          <h2>QR Code da Troca</h2>
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
                    Copiar Código
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
        <div>
          <h2 className="troca-modal-title">Validar QR Code</h2>
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
              Validar e Concluir
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
