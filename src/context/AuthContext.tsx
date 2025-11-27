import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ToastType, User } from "../types/common";

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: (showToast?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode, onToast: (message: string, type: ToastType) => void }> = ({ children, onToast }) => {
    // Loading user information from local storage when mount
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('currentUser');
        const initialUser: User | null = storedUser ? JSON.parse(storedUser) : null;

        if (initialUser && isSessionExpired(initialUser.expires_at)) {
            // If work session expire while start, delete it
            localStorage.removeItem('currentUser');
            return null;
        }
        return initialUser;
    });

    // Save user information into LocalStorage after changed
    useEffect(() => {
        if (user) {
            localStorage.setItem('currrentUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [user]);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = (showToast = false) => {
        setUser(null);
        localStorage.removeItem('currentUser');
        if (showToast) {
            // Use onToast to transfer into ferom App Component
            onToast("Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại!", 'error');
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (user && user.expires_at && isSessionExpired(user.expires_at)) {
                logout(true);
            }
        }, 60000);
        return () => clearInterval(intervalId);
    }, [user, onToast]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used with an AuthProvider');
    }
    return context;
};

// Function check token and calculator time to expire
export const isSessionExpired = (expiredAt: string): boolean => {
    const expiryTime = new Date(expiredAt).getTime();
    const currentTime = new Date().getTime();
    // Add a buffer 5 seconds to avoid time synchronization errors
    const buffer = 5000;

    return expiryTime - buffer < currentTime;
};