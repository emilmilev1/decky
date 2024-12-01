import React, { useState, useContext } from "react";
import { createDeck } from "../api/decks";
import { AuthContext } from "../context/AuthContext";

const DeckForm = () => {
    const [name, setName] = useState("");
    const [cards, setCards] = useState("");
    const { token } = useContext(AuthContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (token) {
            const cardArray = cards.split(",").map((card) => card.trim());
            createDeck({ name, cards: cardArray }, token).then(() => {
                setName("");
                setCards("");
            });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Deck Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Cards (comma-separated)"
                value={cards}
                onChange={(e) => setCards(e.target.value)}
                required
            />
            <button type="submit">Create Deck</button>
        </form>
    );
};

export default DeckForm;
