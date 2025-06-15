import { createContext, useState, useEffect, ReactNode } from 'react';
import {AuthContextType} from "../types/Context.ts";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children } : {children: ReactNode}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLogout, setIsLogout] = useState(false)

    useEffect(() => {
        const savedToken = localStorage.getItem('jwt_token');
        const savedUser = localStorage.getItem('user_data');

        if (savedToken) {
            try {
                const tokenPayload = JSON.parse(atob(savedToken.split('.')[1]));
                const currentTime = Date.now() / 1000;

                if (tokenPayload.exp > currentTime) {
                    setToken(savedToken);
                    setUsername(savedUser);
                    setIsAuthenticated(true);
                } else {
                    // Token hết hạn
                    localStorage.removeItem('jwt_token');
                    localStorage.removeItem('user_data');
                }
            } catch (error) {
                console.error('Token validation error:', error);
                localStorage.removeItem('jwt_token');
                localStorage.removeItem('user_data');
            }
        }

        setLoading(false);
    }, []);

    const login = (newToken: string, userData?: string) => {
        setToken(newToken);
        setUsername(userData || "");
        setIsAuthenticated(true);
        setIsLogout(false)
        localStorage.setItem('jwt_token', newToken);
        localStorage.setItem('user_data', userData || "");
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        setIsLogout(true)
        setIsAuthenticated(false);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
    };

    const value = {
        isAuthenticated,
        token,
        username,
        login,
        logout,
        loading,
        isLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};