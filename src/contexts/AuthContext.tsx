import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load user from localStorage on mount and refresh from API
    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken) {
                setToken(storedToken);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }

                try {
                    // Fetch fresh user data to get createdAt if missing
                    const response = await fetch(`${API_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const userData = data.data;
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    }
                } catch (err) {
                    console.error('Failed to refresh user data:', err);
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            const { token, ...userData } = data.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(token);
            setUser(userData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const signup = async (name: string, email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            const { token, ...userData } = data.data;

            // Store in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setToken(token);
            setUser(userData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                signup,
                logout,
                isLoading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
