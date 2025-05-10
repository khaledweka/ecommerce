import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';

// Protected Route component
const PrivateRoute = ({ children }) => {
    const { isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
        return null; // or a loading spinner
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Navbar />
                        <Box component="main" sx={{ flexGrow: 1 }}>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/products/:id" element={<ProductDetails />} />
                                <Route
                                    path="/cart"
                                    element={
                                        <PrivateRoute>
                                            <Cart />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/checkout"
                                    element={
                                        <PrivateRoute>
                                            <Checkout />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <PrivateRoute>
                                            <Orders />
                                        </PrivateRoute>
                                    }
                                />
                                <Route
                                    path="/orders/:id"
                                    element={
                                        <PrivateRoute>
                                            <OrderDetails />
                                        </PrivateRoute>
                                    }
                                />
                                <Route path="/" element={<Navigate to="/products" />} />
                            </Routes>
                        </Box>
                    </Box>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

// Create root and render
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} 