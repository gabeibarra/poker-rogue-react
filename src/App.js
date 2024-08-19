import React, { useState, useEffect } from "react";
import CardPopup from "./CardPopup";
import "./App.css";

// Card deck setup
const suits = ["spades", "hearts", "diamonds", "clubs"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const faceCardToImgID = {"A": 1, 'J': 11, 'Q': 12, 'K': 13}


const createDeck = () => {
  let deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
       deck.push({ rank: rank, suit: suit, image: `/images/card-${suit}-${faceCardToImgID[rank] || rank}.png` });
    }
  }
    return shuffleDeck(deck);
};

// Fisher-Yates shuffle algorithm
const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
  }
  return deck;
};

const getRankValue = (rank) => {
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  if (rank === "A") return 14;
  return parseInt(rank);
};

const evaluateHand = (hand) => {
  const rankCounts = {};
  const suitCounts = {};
  const rankValues = [];

  for (let card of hand) {
    const rank = card.rank;
    const suit = card.suit;

    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    suitCounts[suit] = (suitCounts[suit] || 0) + 1;
 rankValues.push(getRankValue(rank));
  }

  rankValues.sort((a, b) => a - b);

  const isFlush = Object.values(suitCounts).some(count => count === 5);
  const isStraight = rankValues.every((val, i, arr) => !i || val === arr[i - 1] + 1);
  const isRoyal = rankValues.join() === "10,11,12,13,14";

  if (isStraight && isFlush && isRoyal) return "Royal Flush";
  if (isStraight && isFlush) return "Straight Flush";
  if (Object.values(rankCounts).includes(4)) return "Four of a Kind";
  if (Object.values(rankCounts).includes(3) && Object.values(rankCounts).includes(2)) return "Full House";
  if (isFlush) return "Flush";
  if (isStraight) return "Straight";
  if (Object.values(rankCounts).includes(3)) return "Three of a Kind";
  if (Object.values(rankCounts).filter(count => count === 2).length === 2) return "Two Pair";
  if (Object.values(rankCounts).includes(2)) return "One Pair";

  return "High Card";
};

const Card = ({ card, onClick, isSelected }) => (
  <div
    className={`card ${isSelected ? "selected" : ""}`}
    style={{ backgroundImage: `url(${card.image})` }}
    onClick={onClick}
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
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [discardRounds, setDiscardRounds] = useState(0);
  const [handsRemaining, setHandsRemaining] = useState(4);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const maxDiscardRounds = 3;

  useEffect(() => {
    setDeck(createDeck());
  }, []);

 const dealCards = () => {
    if (handsRemaining > 0) {
      setDeck(createDeck());
      setPlayerHand(deck.slice(0, 5).map(card => ({ ...card, selected: false })));
      setDiscardRounds(0);
      setHandsRemaining(handsRemaining - 1);
    }
  };

  const toggleCardSelection = (index) => {
    setPlayerHand(prevHand =>
      prevHand.map((card, i) => (i === index ? { ...card, selected: !card.selected } : card))
    );
  };

  const discardAndDeal = () => {
    if (discardRounds >= maxDiscardRounds) return;

    const newHand = playerHand.map(card => (card.selected ? deck.pop() : card));
    setPlayerHand(newHand);
    setDiscardRounds(prev => prev + 1);
  };

    const openPopup = () => {
      console.log('clicked')
      setIsPopupOpen(true)
    }
  const closePopup = () => setIsPopupOpen(false);

  const renderHand = () => (
    playerHand.map((card, index) => (
      <Card
        key={index}
        card={card}
        onClick={() => toggleCardSelection(index)}
        isSelected={card.selected}
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
      <CardStack deckCount={deck.length} onClick={openPopup} />
      <CardPopup isOpen={isPopupOpen} onClose={closePopup} remainingDeck={deck} />
    </div>
  );
};


export default App;
