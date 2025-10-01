import React from 'react';

const GoldMembershipModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content gold-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <div className="gold-modal-header">
          <span className="gold-badge">✨</span>
          <h2>Unlock Quantum Gold</h2>
          <p>Experience premium benefits and exclusive savings!</p>
        </div>

        <div className="gold-modal-body">
          <div className="benefit-item">
            <span className="benefit-icon">💸</span>
            <div>
              <h4>Up to 30% Extra Off</h4>
              <p>Enjoy exclusive discounts on thousands of selected Gold-eligible products.</p>
            </div>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🚚</span>
            <div>
              <h4>Fastest Delivery</h4>
              <p>Your orders get top priority and are delivered to you even faster, for free.</p>
            </div>
          </div>
        </div>

        <button className="join-now-button" onClick={() => alert('Gold membership sign-up coming soon!')}>
          Join Now for $99/year
        </button>
      </div>
    </div>
  );
};

export default GoldMembershipModal;
