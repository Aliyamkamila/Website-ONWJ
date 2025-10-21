import React from "react";

export default function ProgramCard({ image, title, description, link }) {
  return (
    <div className="program-card">
      <img src={image} alt={title} className="program-image" />
      <div className="program-content">
        <h3>{title}</h3>
        <p>{description}</p>
        {link && (
          <a href={link} className="read-more">
            Read More →
          </a>
        )}
      </div>
    </div>
  );
}