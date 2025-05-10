import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                            Ecommerce
                        </Link>
                    </Typography>
                    {user ? (
                        <>
                            <Button color="inherit" component={Link} to="/products">
                                Products
                            </Button>
                            <Button color="inherit" component={Link} to="/orders">
                                Orders
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                {children}
            </Container>
        </Box>
    );
};

export default MainLayout; 