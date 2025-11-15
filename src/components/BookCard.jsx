import React from "react";
import { Link } from "react-router-dom";
import "./BookCard.css";

export default function BookCard({
  id,
  imgSrc,
  title,
  author,
  year,
  buttonText = "Ver Detalhes",
  buttonStyle = "primary",
}) {
  const linkTo = `/livro/${id}`;
  const isDisabled = buttonStyle === "disabled";

  let buttonClassName = "book-card-btn";
  if (buttonStyle === "default") {
    buttonClassName += " btn-default";
  } else if (isDisabled) {
    buttonClassName += " btn-disabled";
  }

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
    }
  };

  return (
    <div className="book-card">
      <Link
        to={linkTo}
        className="book-card-image-link"
        onClick={handleClick}
        tabIndex={isDisabled ? -1 : undefined}
      >
        <div className="book-card-image-wrapper">
          {imgSrc ? (
            <img src={imgSrc} alt={title} className="book-card-image" />
          ) : (
            <div className="book-card-image-placeholder">
              <span>&#128213;</span>
            </div>
          )}
        </div>
      </Link>
      <h3 className="book-card-title">{title}</h3>
      <p className="book-card-author">{author}</p>
      <p className="book-card-year">{year}</p>

      <Link
        to={linkTo}
        className={buttonClassName}
        onClick={handleClick}
        aria-disabled={isDisabled}
        tabIndex={isDisabled ? -1 : undefined}
      >
        {buttonText}
      </Link>
    </div>
  );
}
