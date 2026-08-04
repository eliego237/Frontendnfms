import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get("/me");

            setUser(response.data.data);

        } catch (error) {

            console.error(error);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);

        } finally {

            setLoading(false);

        }
    }

    async function login(credentials) {

        const response = await api.post("/login", credentials);

        const token = response.data.data.token;

        const loggedUser = response.data.data.user;

        localStorage.setItem("token", token);

        localStorage.setItem(
            "user",
            JSON.stringify(loggedUser)
        );

        setUser(loggedUser);

        return loggedUser;
    }

    async function logout() {

        try {

            await api.post("/logout");

        } catch (error) {

            console.error(error);

        } finally {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}