import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
    username: string;
}

/**
 *
 * @param token
 * @returns string | null
 */
export const decodeToken = (token: string): string | null => {
    try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        return decodedToken.username;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
