import React from "react";
import { Link } from "react-router-dom";
import "./NotificationCard.css";

export default function NotificationCard({
  title,
  text,
  buttonText,
  buttonLink,
}) {
  return (
    <div className="notification-card">
      <div className="notification-icon">&#128100;</div>
      <div className="notification-content">
        <h4 className="notification-title">{title}</h4>
        <p className="notification-text">{text}</p>
      </div>
      <div className="notification-action">
        <Link to={buttonLink} className="notification-btn">
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
