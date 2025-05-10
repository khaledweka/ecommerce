import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    IconButton,
    Divider,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MainLayout from '../Layouts/MainLayout';
import { cartAPI } from '../services/api';
import ProductImage from '../components/ProductImage';

const Cart = () => {
    const [cart, setCart] = useState({});
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await cartAPI.get();
            setCart(response.data.cart || {});
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            const response = await cartAPI.updateItem(productId, quantity);
            setCart(response.data.cart || {});
            fetchCart(); // Refresh cart to get updated total
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            const response = await cartAPI.removeItem(productId);
            setCart(response.data.cart || {});
            fetchCart(); // Refresh cart to get updated total
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : '0.00';
    };

    if (loading) {
        return (
            <MainLayout>
                <Typography>Loading cart...</Typography>
            </MainLayout>
        );
    }

    const cartItems = Object.values(cart);

    return (
        <MainLayout>
            <Typography variant="h4" component="h1" gutterBottom>
                Shopping Cart
            </Typography>
            {cartItems.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        {cartItems.map((item) => (
                            <Card key={item.id} sx={{ mb: 2 }}>
                                <CardContent>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={3}>
                                            <ProductImage
                                                src={item.image_url}
                                                alt={item.name}
                                                width={100}
                                                height={100}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography variant="h6">{item.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                ${formatPrice(item.price)} each
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.id,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography sx={{ mx: 2 }}>
                                                    {item.quantity}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Typography variant="h6">
                                                    ${formatPrice(item.price * item.quantity)}
                                                </Typography>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                }}
                            >
                                <Typography>Subtotal</Typography>
                                <Typography>${formatPrice(total)}</Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </MainLayout>
    );
};

export default Cart; 