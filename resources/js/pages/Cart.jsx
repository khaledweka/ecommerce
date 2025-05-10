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
import MainLayout from '../Layouts/MainLayout';
import { cartAPI } from '../services/api';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';

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
            await cartAPI.updateItem(productId, quantity);
            fetchCart();
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartAPI.removeItem(productId);
            fetchCart();
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

    // Example shipping and tax calculation (customize as needed)
    const shipping = cartItems.length > 0 ? 15 : 0;
    const tax = cartItems.length > 0 ? total * 0.0325 : 0;
    const subtotal = total;
    const grandTotal = subtotal + shipping + tax;

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
                        <Card>
                            <CardContent>
                                {cartItems.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onIncrease={(id) => handleUpdateQuantity(id, item.quantity + 1)}
                                        onDecrease={(id) => handleUpdateQuantity(id, item.quantity - 1)}
                                        onRemove={handleRemoveItem}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <OrderSummary
                            items={cartItems}
                            subtotal={subtotal}
                            shipping={shipping}
                            tax={tax}
                            total={grandTotal}
                            onCheckout={() => navigate('/checkout')}
                        />
                    </Grid>
                </Grid>
            )}
        </MainLayout>
    );
};

export default Cart; 