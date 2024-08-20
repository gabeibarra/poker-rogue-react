// CardPopup.js
import React from 'react';
import './CardPopup.css'; // Import CSS for styling

const suits = ["spades", "hearts", "diamonds", "clubs"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const CardPopup = ({ isOpen, onClose, remainingDeck }) => {
  if (!isOpen) return null;
  const groupedCards = suits.reduce((acc, suit) => {
    acc[suit] = remainingDeck.filter(card => card.suit === suit);
    return acc;
  }, {});

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>Close</button>

        {suits.map(suit => (
          <div key={suit} className="suit-group">
            <h3>{suit.charAt(0).toUpperCase() + suit.slice(1)}</h3>
            <div className="card-grid">
              {groupedCards[suit].map((card, index) => (
                <div key={index} className="cards-remaining-popup-card" style={{ backgroundImage: `url(${card.image})` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardPopup;
