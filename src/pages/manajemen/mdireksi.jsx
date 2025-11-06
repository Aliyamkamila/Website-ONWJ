import React, { useState } from 'react';
import './mdireksi.css';

const Direksi = () => {
  const [selectedDirector, setSelectedDirector] = useState(null);

  const directors = [
    {
      name: 'Consectetur Adipiscing',
      position: 'Chief Executive Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.'
    },
    {
      name: 'Sed Do Eiusmod',
      position: 'Chief Operating Officer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3',
      description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus.'
    }
  ];

  const openModal = (director) => {
    setSelectedDirector(director);
  };

  const closeModal = () => {
    setSelectedDirector(null);
  };

  return (
    <section className="direksi-section">
      <div className="section-container">
        <h2 className="section-title">
          Dewan Direksi
        </h2>
        <div className="direksi-grid">
          {directors.map((director, index) => (
            <div 
              key={index} 
              className="director-card"
              onClick={() => openModal(director)}
            >
              <div className="director-card-inner">
                <img
                  className="director-image"
                  src={director.image}
                  alt={director.name}
                />
                <div className="director-overlay"></div>
                <div className="director-info">
                  <p className="director-position">{director.position}</p>
                  <h3 className="director-name">{director.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedDirector && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="modal-body">
              <img
                className="modal-image"
                src={selectedDirector.image}
                alt={selectedDirector.name}
              />
              <div className="modal-info">
                <h3 className="modal-title">
                  {selectedDirector.name}
                </h3>
                <p className="modal-position">
                  {selectedDirector.position}
                </p>
                <p className="modal-description">
                  {selectedDirector.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Direksi;