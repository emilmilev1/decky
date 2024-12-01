import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { decodeToken } from "../utils/decode";

const Dashboard = () => {
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const username = decodeToken(token);
    if (!username) {
        return <div>Error decoding the token or username not found.</div>;
    }

    return (
        <div>
            <h1>Welcome to your Dashboard, {username}!</h1>
            <p>Here you can manage your Clash Royale decks.</p>
        </div>
    );
};

export default Dashboard;
