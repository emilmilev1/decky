import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { decodeToken } from "../utils/decode";
import { getCards, createDeck } from "../api/decks";

type Card = {
    id: string;
    name: string;
    iconUrls: { medium: string };
};

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cards, setCards] = useState<Card[]>([]);
    const [filteredCards, setFilteredCards] = useState<Card[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [username, setUsername] = useState<string | null>(null);

    const [isCreatingDeck, setIsCreatingDeck] = useState(false);
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [deckName, setDeckName] = useState("");
    const [deckDescription, setDeckDescription] = useState("");

    useEffect(() => {
        if (token) {
            const decodedUsername = decodeToken(token);
            setUsername(decodedUsername);
        }
    }, [token]);

    useEffect(() => {
        if (!token) return;

        async function fetchCards() {
            try {
                if (token) {
                    const response = await getCards(token);
                    setCards(response.data);
                    setFilteredCards(response.data);
                }
            } catch (error) {
                console.error("Error fetching cards:", error);
            }
        }

        fetchCards();
    }, [token]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredCards(
            cards.filter((card) =>
                card.name.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleCardSelect = (card: Card) => {
        if (selectedCards.find((selectedCard) => selectedCard.id === card.id)) {
            setSelectedCards(
                selectedCards.filter(
                    (selectedCard) => selectedCard.id !== card.id
                )
            );
        } else {
            if (selectedCards.length < 8) {
                setSelectedCards([...selectedCards, card]);
            }
        }
    };

    const handleCreateDeck = async () => {
        if (deckName.trim() === "") {
            alert("Please enter a deck name.");
            return;
        }
        if (deckDescription.trim() === "") {
            alert("Please enter a deck description.");
            return;
        }
        if (selectedCards.length !== 8) {
            alert("You must select 8 cards to create a deck.");
            return;
        }

        try {
            const cards = selectedCards.map((card) => ({
                id: card.id,
                name: card.name,
                iconUrl: card.iconUrls.medium,
            }));
            const response = await createDeck(
                deckName,
                deckDescription,
                cards,
                token as string
            );
            console.log("Deck created successfully:", response);
            navigate("/decks");
        } catch (error) {
            console.error("Error creating deck:", error);
            alert("Error creating deck. Please try again.");
        }
    };

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            {username ? (
                <>
                    <h1>Welcome to your Dashboard, {username}!</h1>
                    <p>Here you can manage your Clash Royale decks.</p>

                    {/* Start Creating Deck Button */}
                    {!isCreatingDeck ? (
                        <button onClick={() => setIsCreatingDeck(true)}>
                            Start Creating a Deck
                        </button>
                    ) : (
                        <>
                            <h2>Create a New Deck</h2>

                            {/* Deck Name Input */}
                            <input
                                type="text"
                                placeholder="Enter Deck Name"
                                value={deckName}
                                onChange={(e) => setDeckName(e.target.value)}
                            />

                            {/* Deck Description */}
                            <input
                                type="text"
                                placeholder="Enter Deck Description"
                                value={deckDescription}
                                onChange={(e) =>
                                    setDeckDescription(e.target.value)
                                }
                            />

                            {/* Search Bar */}
                            <input
                                type="text"
                                placeholder="Search cards by name..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                            {/* Card List - Show cards only when creating a deck */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "16px",
                                }}
                            >
                                {filteredCards.map((card) => (
                                    <div
                                        key={card.id}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            padding: "16px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            backgroundColor: selectedCards.some(
                                                (selectedCard) =>
                                                    selectedCard.id === card.id
                                            )
                                                ? "#d3d3d3"
                                                : "#fff",
                                        }}
                                        onClick={() => handleCardSelect(card)}
                                    >
                                        <img
                                            id={card.id}
                                            src={card.iconUrls.medium}
                                            alt={card.name}
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                            }}
                                        />
                                        <p>{card.name}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Show selected cards in slots */}
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "16px",
                                    marginTop: "20px",
                                }}
                            >
                                {[...Array(8)].map((_, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            border: "1px solid #ccc",
                                            borderRadius: "8px",
                                            padding: "16px",
                                            textAlign: "center",
                                            backgroundColor: "#f0f0f0",
                                            width: "100px",
                                        }}
                                    >
                                        {selectedCards[index] ? (
                                            <>
                                                <img
                                                    src={
                                                        selectedCards[index]
                                                            .iconUrls.medium
                                                    }
                                                    alt={
                                                        selectedCards[index]
                                                            .name
                                                    }
                                                    style={{
                                                        width: "80px",
                                                        height: "80px",
                                                        marginBottom: "8px",
                                                    }}
                                                />
                                                <p>
                                                    {selectedCards[index].name}
                                                </p>
                                            </>
                                        ) : (
                                            <p>Slot {index + 1}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Create Deck Button */}
                            <button
                                onClick={handleCreateDeck}
                                disabled={
                                    selectedCards.length !== 8 ||
                                    deckName.trim() === "" ||
                                    deckDescription.trim() === ""
                                }
                            >
                                Create Deck
                            </button>
                        </>
                    )}
                </>
            ) : (
                <div>Error decoding the token or username not found.</div>
            )}
        </div>
    );
};

export default Dashboard;
