import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
    Box,
    Container,
} from '@mui/material';
import {
    ShoppingCart as CartIcon,
    ShoppingBag as OrdersIcon,
    Store as ProductsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* Logo and Brand */}
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 700,
                        }}
                    >
                        <ProductsIcon sx={{ mr: 1 }} />
                        E-Commerce
                    </Typography>

                    {/* Navigation Links */}
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                        <Button
                            component={RouterLink}
                            to="/products"
                            color="inherit"
                            startIcon={<ProductsIcon />}
                        >
                            Products
                        </Button>
                        {isAuthenticated && (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/cart"
                                    color="inherit"
                                    startIcon={
                                        <Badge badgeContent={0} color="error">
                                            <CartIcon />
                                        </Badge>
                                    }
                                >
                                    Cart
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/orders"
                                    color="inherit"
                                    startIcon={<OrdersIcon />}
                                >
                                    Orders
                                </Button>
                            </>
                        )}
                    </Box>

                    {/* Auth Buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isAuthenticated ? (
                            <>
                                <Typography variant="body2" sx={{ mr: 1 }}>
                                    {user?.name}
                                </Typography>
                                <IconButton
                                    color="inherit"
                                    onClick={handleLogout}
                                    title="Logout"
                                >
                                    <LogoutIcon />
                                </IconButton>
                            </>
                        ) : (
                            <Button
                                component={RouterLink}
                                to="/login"
                                color="inherit"
                                variant="outlined"
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar; 