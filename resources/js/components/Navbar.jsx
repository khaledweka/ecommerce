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
import { Link } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ backgroundColor: '#fff', color: '#111' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <img src="/images/logo.png" alt="izam logo" style={{ height: 36, marginRight: 12 }} />
                        </Link>
                    </Box>

                    {/* Logo and Brand */}
                    {/* <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: '#111',
                            fontWeight: 700,
                        }}
                    >
                        <ProductsIcon sx={{ mr: 1, color: '#111' }} />
                        E-Commerce
                    </Typography> */}

                    {/* Navigation Links */}
                    <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                        <Button
                            component={RouterLink}
                            to="/products"
                            sx={{ color: '#111' }}
                            startIcon={<ProductsIcon sx={{ color: '#111' }} />}
                        >
                            Products
                        </Button>
                        {isAuthenticated && (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/products/new"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<AddCircleOutlineIcon />}
                                    sx={{ ml: 2, fontWeight: 600 }}
                                >
                                    Sell Your Product
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/cart"
                                    sx={{ color: '#111' }}
                                    startIcon={
                                        <Badge badgeContent={0} color="error">
                                            <CartIcon sx={{ color: '#111' }} />
                                        </Badge>
                                    }
                                >
                                    Cart
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/orders"
                                    sx={{ color: '#111' }}
                                    startIcon={<OrdersIcon sx={{ color: '#111' }} />}
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
                                <Typography variant="body2" sx={{ mr: 1, color: '#111' }}>
                                    {user?.name}
                                </Typography>
                                <IconButton
                                    sx={{ color: '#111' }}
                                    onClick={handleLogout}
                                    title="Logout"
                                >
                                    <LogoutIcon sx={{ color: '#111' }} />
                                </IconButton>
                            </>
                        ) : (
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="contained"
                                color="primary"
                                sx={{ fontWeight: 600 }}
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