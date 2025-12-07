import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserCard from "../components/UserCard";
import Modal from "../components/Modal";
import AddBookModal from "../components/AddBookModal";
import { API_BASE_URL } from "../services/api";
import "./LivroDetalhes.css";

import avatarDefault from "../assets/avatar-jonatas.jpeg";

export default function LivroDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sinopse");

  const [owners, setOwners] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [isAddedToShelf, setIsAddedToShelf] = useState(false);
  const [internalId, setInternalId] = useState(null);

  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  const [meusLivros, setMeusLivros] = useState([]);
  const [livroOferecido, setLivroOferecido] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [local, setLocal] = useState("");
  const [observacao, setObservacao] = useState("");

  // ✅ FIX 1: Obter ID do usuário logado UMA VEZ
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUserId(parsedUser.id);
      } catch (e) {
        console.error("Erro ao ler usuário logado:", e);
      }
    }
  }, []); // ← SEM DEPENDÊNCIAS!

  // ✅ FIX 2: fetchData SEM currentUserId como dependência
  const fetchData = useCallback(async () => {
    try {
      let googleBookData = null;
      let backendBookId = null;

      const isBackendId = /^\d+$/.test(id);

      if (isBackendId) {
        backendBookId = id;
        const token = localStorage.getItem("token");

        const backendRes = await fetch(`${API_BASE_URL}/livros/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!backendRes.ok) throw new Error("Livro não encontrado no sistema.");
        const backendData = await backendRes.json();

        try {
          const searchRes = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
              backendData.titulo
            )}&maxResults=1`
          );
          const searchData = await searchRes.json();

          if (searchData.items && searchData.items.length > 0) {
            googleBookData = searchData.items[0].volumeInfo;
          } else {
            googleBookData = {
              title: backendData.titulo,
              authors: [backendData.autor],
              publisher: backendData.editora,
              categories: [backendData.genero],
              description: backendData.descricao,
              publishedDate: backendData.ano.toString(),
              imageLinks: { thumbnail: "" },
            };
          }
        } catch (err) {
          console.error("Erro Google", err);
          googleBookData = {
            title: backendData.titulo,
            authors: [backendData.autor],
            publisher: backendData.editora,
            categories: [backendData.genero],
            description: backendData.descricao,
            publishedDate: backendData.ano.toString(),
            imageLinks: { thumbnail: "" },
          };
        }
      } else {
        const googleRes = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        if (!googleRes.ok) throw new Error("Erro ao buscar livro no Google");
        const googleData = await googleRes.json();
        googleBookData = googleData.volumeInfo;
      }

      setBook(googleBookData);

      const token = localStorage.getItem("token");
      if (token) {
        if (backendBookId) {
          try {
            const ownersRes = await fetch(
              `${API_BASE_URL}/livros/${backendBookId}/usuarios`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (ownersRes.ok) {
              const ownersData = await ownersRes.json();

              // ✅ Pega currentUserId do localStorage dentro da função
              const storedUser = localStorage.getItem("user");
              const userId = storedUser ? JSON.parse(storedUser).id : null;

              const sortedOwners = ownersData.sort((a, b) => {
                if (Number(a.id) === Number(userId)) return -1;
                if (Number(b.id) === Number(userId)) return 1;
                return 0;
              });

              setOwners(sortedOwners);
            } else {
              setOwners([]);
            }
          } catch (err) {
            console.error("Erro ao buscar donos do livro:", err);
            setOwners([]);
          }
        } else {
          try {
            const ownersRes = await fetch(
              `${API_BASE_URL}/livros/google/${id}/usuarios`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (ownersRes.ok) {
              const ownersData = await ownersRes.json();

              const storedUser = localStorage.getItem("user");
              const userId = storedUser ? JSON.parse(storedUser).id : null;

              const sortedOwners = ownersData.sort((a, b) => {
                if (Number(a.id) === Number(userId)) return -1;
                if (Number(b.id) === Number(userId)) return 1;
                return 0;
              });

              setOwners(sortedOwners);
            } else {
              setOwners([]);
            }
          } catch (err) {
            console.error("Erro ao buscar donos do Google Book:", err);
            setOwners([]);
          }
        }

        const myBooksRes = await fetch(`${API_BASE_URL}/livros/meus-livros`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (myBooksRes.ok) {
          const myBooksData = await myBooksRes.json();
          setMeusLivros(myBooksData);
          if (myBooksData.length > 0) setLivroOferecido(myBooksData[0].id);

          let match = null;

          if (isBackendId) {
            match = myBooksData.find((b) => b.id.toString() === id.toString());
          } else if (googleBookData) {
            match = myBooksData.find(
              (b) =>
                b.titulo.toLowerCase() === googleBookData.title.toLowerCase()
            );
          }

          if (match) {
            setIsAddedToShelf(true);
            setInternalId(match.id);
          } else {
            setIsAddedToShelf(false);
            setInternalId(null);
          }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar detalhes.");
    } finally {
      setLoading(false);
    }
  }, [id]); // ← APENAS 'id' como dependência!

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemoveFromShelf = async () => {
    if (!internalId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/livros/${internalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok || response.status === 204) {
        toast.info("Livro removido da estante.");
        setIsRemoveModalOpen(false);

        if (/^\d+$/.test(id)) {
          navigate("/minha-estante");
        } else {
          fetchData();
        }
      } else {
        toast.error("Erro ao remover livro.");
      }
    } catch (error) {
      toast.error("Erro de conexão.");
    }
  };

  const handleShelfAction = () => {
    if (isAddedToShelf) {
      setIsRemoveModalOpen(true);
    } else {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Você precisa estar logado.");
        return;
      }
      setIsAddBookModalOpen(true);
    }
  };

  const handleSuccessAdd = () => {
    fetchData();
  };

  const handleTradeClick = (user) => {
    setTargetUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTargetUser(null);
    // Limpar campos
    setLivroOferecido(meusLivros[0]?.id || "");
    setDataHora("");
    setLocal("");
    setObservacao("");
  };

  // ✅ FIX 3: Payload correto para o backend
  const handleSubmitProposta = async (event) => {
    event.preventDefault();

    if (!livroOferecido || !dataHora || !local) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const currentUser = JSON.parse(storedUser);

      // ✅ Payload correto conforme o backend espera
      const propostaPayload = {
        proponenteId: currentUser.id, // ← ID do usuário logado
        propostoId: targetUser.id, // ← ID do destinatário
        status: "PENDENTE", // ← Status inicial
      };

      console.log("📤 Enviando proposta:", propostaPayload);

      const response = await fetch(`${API_BASE_URL}/propostas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propostaPayload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Proposta criada:", data);
        toast.success(`Proposta enviada para ${targetUser.nome}!`);
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("❌ Erro do servidor:", errorData);
        toast.error(errorData.message || "Erro ao enviar proposta.");
      }
    } catch (error) {
      console.error("❌ Erro de conexão:", error);
      toast.error("Erro de conexão.");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <p>Carregando detalhes... </p>
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
    : "Sem sinopse disponível. ";

  const currentBookData = {
    googleId: /^\d+$/.test(id) ? null : id,
    titulo: book.title,
    autor: book.authors ? book.authors[0] : "Desconhecido",
    editora: book.publisher || "Editora não informada",
    genero: book.categories ? book.categories[0] : "Geral",
    ano: book.publishedDate ? book.publishedDate.substring(0, 4) : "2000",
    imagemUrl: book.imageLinks?.thumbnail || "",
    descricao: book.description || "",
    isbn:
      book.industryIdentifiers && book.industryIdentifiers.length > 0
        ? book.industryIdentifiers[0].identifier
        : "",
  };

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
                <strong>Páginas:</strong> {book.pageCount || "? "}
              </span>
            </div>
          </section>

          <nav className="livro-nav-tabs">
            <button
              className={`livro-tab-btn ${
                activeTab === "sinopse" ? "active" : ""
              }`}
              onClick={() => setActiveTab("sinopse")}
            >
              Sinopse
            </button>
            <button
              className={`livro-tab-btn ${
                activeTab === "quemTem" ? "active" : ""
              }`}
              onClick={() => setActiveTab("quemTem")}
            >
              Quem Tem?
            </button>
          </nav>

          <div className="livro-tab-content">
            {activeTab === "sinopse" && (
              <>
                <section className="detalhes-sinopse">
                  <p>{cleanDescription}</p>
                </section>
                <section className="detalhes-avaliacao">
                  <h3>Avaliação Geral</h3>
                  <div className="estrelas">
                    {book.averageRating ? (
                      <span>&#9733; {book.averageRating} / 5</span>
                    ) : (
                      <span>Sem avaliações</span>
                    )}
                  </div>
                </section>
              </>
            )}

            {activeTab === "quemTem" && (
              <section className="owners-list">
                {owners.length === 0 ? (
                  <p>
                    {/^\d+$/.test(id)
                      ? "Ninguém mais possui este livro na estante."
                      : "Ninguém possui este livro na estante ainda.  Seja o primeiro! "}
                  </p>
                ) : (
                  owners.map((owner) => {
                    const isCurrentUser =
                      Number(owner.id) === Number(currentUserId);

                    return (
                      <UserCard
                        key={owner.id}
                        id={owner.id}
                        name={owner.nome}
                        rating={owner.notaMedia || owner.avaliacao || 0}
                        tradeCount={owner.totalTrocas || 0}
                        avatarImg={owner.avatarUrl || avatarDefault}
                        isCurrentUser={isCurrentUser}
                        onTradeClick={() => handleTradeClick(owner)}
                      />
                    );
                  })
                )}
              </section>
            )}
          </div>
        </div>

        <div className="detalhes-coluna-direita">
          <img
            src={coverImage}
            alt={`Capa de ${book.title}`}
            className="detalhes-capa"
          />

          <button
            className={`btn-add-estante ${isAddedToShelf ? "remove-mode" : ""}`}
            onClick={handleShelfAction}
          >
            {isAddedToShelf
              ? "Remover da minha estante"
              : "Adicionar à minha estante"}
          </button>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="proposta-form-title">Troca com {targetUser?.nome}</h2>
        <form className="proposta-form" onSubmit={handleSubmitProposta}>
          <div className="form-group">
            <label htmlFor="livro-oferecido">Livro para oferecer:</label>
            <select
              id="livro-oferecido"
              value={livroOferecido}
              onChange={(e) => setLivroOferecido(e.target.value)}
            >
              <option value="" disabled>
                Selecione um livro
              </option>
              {meusLivros.map((livro) => (
                <option key={livro.id} value={livro.id}>
                  {livro.titulo}
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
              Cancelar
            </button>
            <button type="submit" className="btn-enviar-proposta">
              Enviar Proposta
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
      >
        <h2 className="proposta-form-title">Remover Livro</h2>
        <p className="remove-modal-text">
          Tem certeza que deseja remover <strong>{book.title}</strong> da sua
          estante?
          <br />
          Esta ação não pode ser desfeita.
        </p>
        <div className="proposta-modal-actions">
          <button
            type="button"
            className="btn-fechar-modal"
            onClick={() => setIsRemoveModalOpen(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-remover-confirm"
            onClick={handleRemoveFromShelf}
          >
            Sim, Remover
          </button>
        </div>
      </Modal>

      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        initialBook={currentBookData}
        onSuccess={handleSuccessAdd}
      />
    </>
  );
}
