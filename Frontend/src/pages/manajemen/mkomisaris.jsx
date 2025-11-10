import React, { useState } from 'react';
import './mkomisaris.css';

const Komisaris = () => {
  const [selectedCommissioner, setSelectedCommissioner] = useState(null);

  const commissioners = [
    {
      name: 'Lorem Ipsum',
      position: 'President Commissioner',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3',
      description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.'
    }
  ];

  const openModal = (commissioner) => {
    setSelectedCommissioner(commissioner);
  };

  const closeModal = () => {
    setSelectedCommissioner(null);
  };

  return (
    <section className="komisaris-section">
      <div className="section-container">
        <h2 className="section-title">
          Dewan Komisaris
        </h2>
        <div className="komisaris-grid">
          {commissioners.map((commissioner, index) => (
            <div 
              key={index} 
              className="commissioner-card"
              onClick={() => openModal(commissioner)}
            >
              <div className="commissioner-card-inner">
                <img
                  className="commissioner-image"
                  src={commissioner.image}
                  alt={commissioner.name}
                />
                <div className="commissioner-overlay"></div>
                <div className="commissioner-info">
                  <p className="commissioner-position">{commissioner.position}</p>
                  <h3 className="commissioner-name">{commissioner.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedCommissioner && (
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
                src={selectedCommissioner.image}
                alt={selectedCommissioner.name}
              />
              <div className="modal-info">
                <h3 className="modal-title">
                  {selectedCommissioner.name}
                </h3>
                <p className="modal-position">
                  {selectedCommissioner.position}
                </p>
                <p className="modal-description">
                  {selectedCommissioner.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Komisaris;