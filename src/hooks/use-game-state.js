import { useState, useEffect } from "react";
import { DEFAULT_DISCARD_ROUNDS, DEFAULT_HAND_ROUNDS, INITIAL_DRAW_COUNT } from "../constants/defaults";

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
    const [isInit, setInit] = useState(false)
    const [score, setScore] = useState(0)
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [discardsRemaining, setDiscardsRemaining] = useState(DEFAULT_DISCARD_ROUNDS);
    const [handsRemaining, setHandsRemaining] = useState(DEFAULT_HAND_ROUNDS);
    const [isDealing, setIsDealing] = useState(false);
    const [handResult, setHandResult] = useState('')
    const maxDiscardRounds = 3;

    useEffect(() => {
        setDeck(createDeck());

    }, []);

    // Start the game:
    useEffect(() => {
        if (isInit || !deck.length) {
            return
        }

        setInit(true)
        dealCards()
    }, [deck, isInit]);

    const dealCards = () => {
        if (handsRemaining === 0) {
            return
        }

        const cardsDrawn = []
        for (let i = 0; i < INITIAL_DRAW_COUNT; i++) {
            // TODO, reshuffle discard pile:
            if (deck.length === 0) {
                break
            }

            // Zero is the bottom of the pile:
            cardsDrawn.push(deck.pop())
        }

        setPlayerHand(cardsDrawn.map(card => ({ ...card, isSelected: false })));
        setHandsRemaining(handsRemaining - 1);
        setDeck(deck)

        // Trigger dealing animation
        setIsDealing(true);
        setTimeout(() => setIsDealing(false), 2000); // Assuming the animation lasts 1 second
    }

    const submitHand = () => {
        setHandResult(evaluateHand(playerHand.filter(card => card.isSelected)))

        setTimeout(() => {
            setHandResult('')
            dealCards()
        }, 4000)
    }

    const toggleCardSelection = (index) => {
        setPlayerHand(prevHand =>
            prevHand.map((card, i) => (i === index ? { ...card, isSelected: !card.isSelected } : card))
        );
    };

    const discardAndDeal = () => {
        if (discardsRemaining === 0) {
            return;
        }

        const newHand = playerHand.map(card => (card.isSelected ? deck.pop() : card));
        setPlayerHand(newHand);
        setDiscardsRemaining(prev => prev - 1);
    };

    return {
        dealCards,
        deck,
        discardAndDeal,
        discardsRemaining,
        handResult,
        handsRemaining,
        isDealing,
        maxDiscardRounds,
        playerHand,
        score,
        submitHand,
        toggleCardSelection,
    };
};