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
    playerHand,
    discardRounds,
    handsRemaining,
    isDealing,
    dealCards,
    toggleCardSelection,
    discardAndDeal,
    maxDiscardRounds,
    evaluateHand,
  } = useGameState();

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const renderHand = () => (
    playerHand.map((card, index) => (
      <Card
        card={card}
        key={index}
        index={index}
        isDealing={isDealing}
        isSelected={card.selected}
        onClick={() => toggleCardSelection(index)}
      />
    ))
  );

  return (
    <div id="game-container">
      <div id="left-panel">
        <button onClick={dealCards} disabled={handsRemaining <= 0}>
          Deal Cards
        </button>
        <button onClick={discardAndDeal} disabled={discardRounds >= maxDiscardRounds || handsRemaining <= 0}>
          Discard Selected Cards
        </button>
        <div id="round-info">Round: {discardRounds + 1} of {maxDiscardRounds}</div>
        <div id="hands-remaining">
          {handsRemaining > 0 ? `Hands Remaining: ${handsRemaining}` : "Game Over"}
        </div>
      </div>
      <div id="player-hand">
        {renderHand()}
      </div>
      {discardRounds === maxDiscardRounds && (
        <div className="result">Final Hand: {evaluateHand(playerHand)}</div>
      )}
      <CardStack deckCount={deck.length} onClick={() => setIsPopupOpen(true)} />
      <CardPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} remainingDeck={deck} />
    </div>
  );
};


export default App;
