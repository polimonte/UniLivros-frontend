import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UserCard from "../components/UserCard";
import Modal from "../components/Modal";
import "./LivroDetalhes.css";

import userAvatarImg from "../assets/avatar-jonatas.jpeg";

const mockMeusLivros = [
  { id: "meu-livro-1", title: "O Senhor dos Anéis" },
  { id: "meu-livro-2", title: "Dom Casmurro" },
  { id: "meu-livro-3", title: "Código Limpo" },
];

export default function LivroDetalhes() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isSolicitado, setSolicitado] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [livroOferecido, setLivroOferecido] = useState(mockMeusLivros[0].id);
  const [dataHora, setDataHora] = useState("");
  const [local, setLocal] = useState("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        if (!response.ok) throw new Error("Erro ao buscar livro");
        const data = await response.json();

        setBook(data.volumeInfo);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar detalhes do livro.");
      } finally {
        setLoading(false);
      }
    }

    fetchBookDetails();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmitProposta = (event) => {
    event.preventDefault();
    if (!livroOferecido || !dataHora || !local) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setSolicitado(true);
    closeModal();
    toast.success("Proposta enviada com sucesso!");
  };

  if (loading)
    return (
      <div className="loading-container">
        <p>Carregando detalhes...</p>
      </div>
    );
  if (!book)
    return (
      <div className="loading-container">
        <p>Livro não encontrado.</p>
      </div>
    );

  const coverImage =
    book.imageLinks?.extraLarge ||
    book.imageLinks?.large ||
    book.imageLinks?.medium ||
    book.imageLinks?.thumbnail ||
    "https://via.placeholder.com/300x450?text=Sem+Capa";

  const cleanDescription = book.description
    ? book.description.replace(/<[^>]+>/g, "")
    : "Sem sinopse disponível.";

  return (
    <>
      <main className="detalhes-main">
        <div className="detalhes-coluna-esquerda">
          <section className="detalhes-info-livro">
            <h1 className="detalhes-titulo">{book.title}</h1>
            <h2 className="detalhes-autor">
              {book.authors ? book.authors.join(", ") : "Autor Desconhecido"}
              {book.publishedDate
                ? ` • ${book.publishedDate.substring(0, 4)}`
                : ""}
            </h2>
            <div className="detalhes-tags">
              <span>
                <strong>Categorias:</strong>{" "}
                {book.categories ? book.categories[0] : "Geral"}
              </span>
              <span>
                <strong>Páginas:</strong> {book.pageCount || "?"}
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
            <p>{cleanDescription}</p>
          </section>

          <section className="detalhes-avaliacao">
            <h3>Avaliação (Google Books)</h3>
            <div className="estrelas">
              {book.averageRating ? (
                <span>&#9733; {book.averageRating} / 5</span>
              ) : (
                <span>Sem avaliações</span>
              )}
            </div>
          </section>
        </div>

        <div className="detalhes-coluna-direita">
          <img
            src={coverImage}
            alt={`Capa de ${book.title}`}
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
