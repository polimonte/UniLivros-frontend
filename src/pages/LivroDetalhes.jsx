import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserCard from "../components/UserCard";
import Modal from "../components/Modal";
import "./LivroDetalhes.css";

import bookCoverImg from "../assets/books/caras-coracoes.jpg";
import userAvatarImg from "../assets/avatar-jonatas.jpeg";

const mockMeusLivros = [
  { id: "alasca", title: "Quem é você Alasca?" },
  { id: "mao-luva", title: "A Mão e a Luva" },
  { id: "outro", title: "Outro Livro Meu" },
];

export default function LivroDetalhes() {
  const { id } = useParams();
  const [isSolicitado, setSolicitado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [livroOferecido, setLivroOferecido] = useState(mockMeusLivros[0].id);
  const [dataHora, setDataHora] = useState("");
  const [local, setLocal] = useState("");
  const [observacao, setObservacao] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmitProposta = (event) => {
    event.preventDefault();
    if (!livroOferecido || !dataHora || !local) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    console.log("--- Proposta Enviada ---");
    console.log("Livro Oferecido:", livroOferecido);
    console.log("Data e Hora:", dataHora);
    console.log("Local:", local);
    console.log("Observação:", observacao);

    setSolicitado(true);
    closeModal();
    toast.success("Proposta enviada com sucesso!");
  };

  return (
    <>
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
            isCurrentUser={false}
          />

          <section className="detalhes-sinopse">
            <p>
              Se você já amou, se perdeu e se reencontrou, esse livro vai te
              abraçar nas entrelinhas.
            </p>
            <p>
              Caras e Corações, de Thomaz Lopes, foi uma leitura que me prendeu
              do início ao fim. O autor tem uma forma leve e profunda de mostrar
              como sentimentos e escolhas moldam quem somos.
            </p>
            <p>
              O livro está em ótimo estado (semi-novo), sem anotações nem
              páginas amassadas — apenas com aquelas boas vibrações de quem
              realmente aproveitou a história.
            </p>
            <p>
              Essa obra me fez refletir sobre amizade, amor e autoconhecimento
              de um jeito que poucas leituras conseguem. Agora quero que ele
              siga viagem e toque outro coração como tocou o meu.
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
          <button
            className={`btn-solicitar ${isSolicitado ? "solicitado" : ""}`}
            onClick={openModal}
            disabled={isSolicitado}
          >
            {isSolicitado ? "Proposta Enviada" : "Solicitar Troca"}
          </button>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="proposta-form-title">Enviar Proposta de Troca</h2>
        <form className="proposta-form" onSubmit={handleSubmitProposta}>
          <div className="form-group">
            <label htmlFor="livro-oferecido">Livro para oferecer:</label>
            <select
              id="livro-oferecido"
              value={livroOferecido}
              onChange={(e) => setLivroOferecido(e.target.value)}
            >
              {mockMeusLivros.map((livro) => (
                <option key={livro.id} value={livro.id}>
                  {livro.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="data-hora">Data e Hora Sugeridas:</label>
            <input
              type="datetime-local"
              id="data-hora"
              value={dataHora}
              onChange={(e) => setDataHora(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="local">Local Sugerido:</label>
            <input
              type="text"
              id="local"
              placeholder="Ex: Pátio da Biblioteca"
              value={local}
              onChange={(e) => setLocal(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="observacao">Observação (opcional):</label>
            <textarea
              id="observacao"
              rows="3"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            ></textarea>
          </div>

          <div className="proposta-modal-actions">
            <button
              type="button"
              className="btn-fechar-modal"
              onClick={closeModal}
            >
              Fechar
            </button>
            <button type="submit" className="btn-enviar-proposta">
              Enviar Proposta
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
