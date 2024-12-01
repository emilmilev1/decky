import axios from "axios";

const API_URL = "http://localhost:4000/decks";

export const getDecks = (token: string) =>
    axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });

export const createDeck = (
    data: { name: string; cards: string[] },
    token: string
) =>
    axios.post(API_URL, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const updateDeck = (
    id: number,
    data: { name: string; cards: string[] },
    token: string
) =>
    axios.put(`${API_URL}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
    });

export const deleteDeck = (id: number, token: string) =>
    axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
