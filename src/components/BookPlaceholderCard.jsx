import React from "react";
import { Link } from "react-router-dom";
import "./BookPlaceholderCard.css";

export default function BookPlaceholderCard() {
  return (
    <Link to="#" className="book-placeholder-card">
      <div className="placeholder-icon">+</div>
    </Link>
  );
}
