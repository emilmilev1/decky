import React, { useEffect, useState, useContext } from "react";
import { getDecks, deleteDeck } from "../api/decks";
import { AuthContext } from "../context/AuthContext";

interface Deck {
    id: number;
    name: string;
    cards: string[];
}

const DeckList = () => {
    const [decks, setDecks] = useState<Deck[]>([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            getDecks(token).then((response) => setDecks(response.data));
        }
    }, [token]);

    const handleDelete = (id: number) => {
        if (token) {
            deleteDeck(id, token).then(() =>
                setDecks(decks.filter((deck) => deck.id !== id))
            );
        }
    };

    return (
        <div>
            <h2>Your Decks</h2>
            <ul>
                {decks.map((deck) => (
                    <li key={deck.id}>
                        {deck.name} - {deck.cards.join(", ")}
                        <button onClick={() => handleDelete(deck.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DeckList;
