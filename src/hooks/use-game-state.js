import { useState, useEffect } from "react";

// Constants for suits and ranks
const suits = ["spades", "hearts", "diamonds", "clubs"];
const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const faceCardToImgID = { "A": 1, 'J': 11, 'Q': 12, 'K': 13 }

// Create and shuffle deck
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

// Helper to get rank value
const getRankValue = (rank) => {
    if (rank === "J") return 11;
    if (rank === "Q") return 12;
    if (rank === "K") return 13;
    if (rank === "A") return 14;
    return parseInt(rank);
};

// Hand evaluation logic
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

export const useGameState = () => {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [discardRounds, setDiscardRounds] = useState(0);
    const [handsRemaining, setHandsRemaining] = useState(4);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDealing, setIsDealing] = useState(false);
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

            // Trigger dealing animation
            setIsDealing(true);
            setTimeout(() => setIsDealing(false), 1000); // Assuming the animation lasts 1 second
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

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return {
        deck,
        playerHand,
        discardRounds,
        handsRemaining,
        isPopupOpen,
        isDealing,
        dealCards,
        toggleCardSelection,
        discardAndDeal,
        openPopup,
        closePopup,
        maxDiscardRounds,
        evaluateHand,
    };
};
