"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the type for user object
interface User {
    _id: string;
    name: string;
    email: string;
    // Other user details you might have
}

interface AuthContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logout: () => void;
    toggle: boolean,
    toggleFetch: () => void;
}

// Create AuthContext with the correct type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap your app and provide auth data
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null); // Store user in state with User type
    const [toggle, setToggle] = useState(false)

    const toggleFetch = () => {
        setToggle(!toggle)
    }

    useEffect(() => {
        // Check localStorage for the token and set the user if available
        const userFromLocalStorage = localStorage.getItem('user');
        if (userFromLocalStorage) {
            // Assuming the 'user' is stored as a JSON string, parse it if needed
            const parsedUser: User = JSON.parse(userFromLocalStorage);
            setUser(parsedUser); // Set the parsed user to state
        }
    }, []);

    // Function to log out the user
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Provide user and logout function to the app
    return (
        <AuthContext.Provider value={{ user, setUser, logout, toggle, toggleFetch }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
