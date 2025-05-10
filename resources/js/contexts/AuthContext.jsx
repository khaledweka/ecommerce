import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [authLoading, setAuthLoading] = React.useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Check authentication status on mount
    React.useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authAPI.getUser();
                    console.log('User API Response:', response.data);
                    
                    if (response.data) {
                        setUser(response.data);
                    } else {
                        throw new Error('No user data received');
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setAuthLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        setAuthLoading(true);
        try {
            const response = await authAPI.login({ email, password });
            console.log('Login Response:', response.data);
            
            const { token, user: userData } = response.data;
            
            if (!token) {
                throw new Error('No token received from login');
            }

            localStorage.setItem('token', token);
            
            // Verify token by making a test request
            const userResponse = await authAPI.getUser();
            console.log('User verification response:', userResponse.data);
            
            if (userResponse.data) {
                setUser(userResponse.data);
                return userResponse.data;
            } else {
                throw new Error('Failed to verify user after login');
            }
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem('token');
            throw error;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        setAuthLoading(true);
        try {
            await authAPI.logout();
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setAuthLoading(false);
            navigate('/login');
        }
    };

    // Authentication helper methods
    const isAuthenticated = () => !!user;
    const getToken = () => localStorage.getItem('token');
    const hasToken = () => !!getToken();
    const getUser = () => user;

    const value = {
        user,
        authLoading,
        isAuthenticated: isAuthenticated(),
        login,
        logout,
        getToken,
        hasToken,
        getUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth }; 