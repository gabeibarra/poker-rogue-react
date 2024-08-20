import React, { useState, useEffect } from "react";
import CardPopup from "./CardPopup";
import "./App.css";
import { useGameState } from "./hooks/use-game-state";

const Card = ({ card, index, isDealing, isSelected, onClick }) => (
  <div
    className={`card ${isSelected ? "selected" : ""} ${isDealing ? "dealing" : ""}`}
    onClick={onClick}
    style={{ backgroundImage: `url(${card.image})`, animationDelay: `${index * 0.2}s` }}
  />
);

// Card stack component
const CardStack = ({ deckCount, onClick }) => (
  <div id="card-stack-container" onClick={onClick}>
    <div id="deck-count">{deckCount} cards left</div>
    <div id="card-stack" />
  </div>
);

const App = () => {
  const {
    deck,
    discardAndDeal,
    discardsRemaining,
    handResult,
    handsRemaining,
    isDealing,
    playerHand,
    score,
    submitHand,
    toggleCardSelection,
  } = useGameState();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const renderHand = () => (
    playerHand.map((card, index) => (
      <Card
        card={card}
        key={index}
        index={index}
        isDealing={isDealing}
        isSelected={card.isSelected}
        onClick={() => toggleCardSelection(index)}
      />
    ))
  );

  return (
    <div id="game-container">
      <div id="left-panel">
        <h1>Score: {score}</h1>
        <h3>Discards Remaining: {discardsRemaining}</h3>
        <button onClick={discardAndDeal} disabled={discardsRemaining === 0 || !playerHand.some(c => c.isSelected)}>
          Discard Selected Cards
        </button>
        <div id="hands-remaining">
          {handsRemaining > 0 ? `Hands Remaining: ${handsRemaining}` : "Game Over"}
        </div>
      </div>
      <div className='player-hand-container'>
        {handResult && (
          <div className="result neon-text">Hand Type: {handResult}</div>
        )}
        <div id="player-hand">
          {renderHand()}
        </div>
        <button onClick={submitHand} disabled={handsRemaining <= 0 || !playerHand.some(c => c.isSelected)}>
          Submit Hand
        </button>
      </div>
      <CardStack deckCount={deck.length} onClick={() => setIsPopupOpen(true)} />
      <CardPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} remainingDeck={deck} />
    </div>
  );
};


export default App;
