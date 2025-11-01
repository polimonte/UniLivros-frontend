import React from "react";
import { Link } from "react-router-dom";
import "./BookCard.css";

export default function BookCard({ id, imgSrc, title, author, year }) {
  const linkTo = `/livro/${id}`;

  return (
    <div className="book-card">
      <Link to={linkTo} className="book-card-image-link">
        <div className="book-card-image-wrapper">
          <img src={imgSrc} alt={title} className="book-card-image" />
        </div>
      </Link>
      <h3 className="book-card-title">{title}</h3>
      <p className="book-card-author">{author}</p>
      <p className="book-card-year">{year}</p>
      <Link to={linkTo} className="book-card-btn">
        TROCAR
      </Link>
    </div>
  );
}
