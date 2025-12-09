import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PerfilHeader from "../components/PerfilHeader";
import BookCard from "../components/BookCard";
import AvaliacaoCard from "../components/AvaliacaoCard";
import ConquistaCard from "../components/ConquistaCard";
import { API_BASE_URL } from "../services/api";
import "./Perfil.css";

import avatarDefault from "../assets/avatar-jonatas.jpeg";

export default function Perfil() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("estante");

  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const userRes = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
          headers,
        });
        if (!userRes.ok) throw new Error("Erro ao carregar usuário.");
        const userData = await userRes.json();
        setProfile(userData);

        const booksRes = await fetch(`${API_BASE_URL}/usuarios/${id}/livros`, {
          headers,
        });
        const booksData = booksRes.ok ? await booksRes.json() : [];

        const processedBooks = await Promise.all(
          booksData.map(async (item) => {
            let googleImage = null;
            let googleYear = item.ano || "N/A";

            try {
              const googleRes = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
                  item.titulo
                )}&maxResults=1`
              );
              const googleData = await googleRes.json();

              if (googleData.items && googleData.items.length > 0) {
                const volumeInfo = googleData.items[0].volumeInfo;
                googleImage = volumeInfo.imageLinks?.thumbnail;
                if (!item.ano && volumeInfo.publishedDate) {
                  googleYear = volumeInfo.publishedDate.substring(0, 4);
                }
              }
            } catch (err) {
              console.error("Erro Google Books:", err);
            }

            return {
              id: item.id,
              title: item.titulo,
              author: item.autor,
              imgSrc: googleImage,
              year: googleYear,
            };
          })
        );
        setBooks(processedBooks);

        const reviewsRes = await fetch(
          `${API_BASE_URL}/usuarios/${id}/avaliacoes`,
          { headers }
        );
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];
        setReviews(reviewsData);

        const achievementsRes = await fetch(
          `${API_BASE_URL}/usuarios/${id}/conquistas`,
          { headers }
        );
        const achievementsData = achievementsRes.ok
          ? await achievementsRes.json()
          : [];
        setAchievements(achievementsData);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar perfil.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, [id]);

  if (isLoading)
    return (
      <div className="loading-container">
        <p>Carregando perfil...</p>
      </div>
    );
  if (!profile)
    return (
      <div className="loading-container">
        <p>Perfil não encontrado.</p>
      </div>
    );

  const headerUser = {
    id: profile.id,
    name: profile.nome,
    avatar: profile.avatarUrl || avatarDefault,
    curso: profile.curso,
    rating: profile.notaMedia || 0,
    tradeCount: profile.totalTrocas || 0,
    conquistaCount: achievements.length,
    livrosDisponiveis: books.length,
  };

  return (
    <main className="perfil-main">
      <PerfilHeader
        user={headerUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "estante" && (
        <section className="perfil-estante">
          {books.length === 0 ? (
            <p>Este usuário ainda não tem livros na estante.</p>
          ) : (
            <div className="book-grid">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  imgSrc={book.imgSrc}
                  title={book.title}
                  author={book.author}
                  year={book.year}
                  buttonStyle="default"
                />
              ))}
            </div>
          )}
        </section>
      )}

      {activeTab === "avaliacoes" && (
        <section className="perfil-avaliacoes">
          {reviews.length === 0 ? (
            <p>Nenhuma avaliação recebida ainda.</p>
          ) : (
            reviews.map((review, index) => (
              <AvaliacaoCard
                key={index}
                title={review.titulo || "Avaliação"}
                text={review.comentario}
              />
            ))
          )}
        </section>
      )}

      {activeTab === "conquistas" && (
        <section className="perfil-conquistas">
          {achievements.length === 0 ? (
            <p>Nenhuma conquista desbloqueada ainda.</p>
          ) : (
            achievements.map((achiev, index) => (
              <ConquistaCard
                key={index}
                iconType={achiev.tipo}
                title={achiev.titulo}
                text={achiev.descricao}
                exp={achiev.xp}
              />
            ))
          )}
        </section>
      )}
    </main>
  );
}
