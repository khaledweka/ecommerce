import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    TextField,
    Container,
    Divider,
} from '@mui/material';
import MainLayout from '../Layouts/MainLayout';
import { cartAPI, ordersAPI } from '../services/api';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await cartAPI.get();
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await ordersAPI.create({
                shipping_address: formData,
            });
            navigate('/orders');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Typography>Loading checkout...</Typography>
            </MainLayout>
        );
    }

    if (!cart || Object.keys(cart.cart).length === 0) {
        return (
            <MainLayout>
                <Container>
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
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container>
                <Typography variant="h4" component="h1" gutterBottom>
                    Checkout
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Shipping Information
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Street Address"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            error={!!errors['shipping_address.street']}
                                            helperText={errors['shipping_address.street']}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            error={!!errors['shipping_address.city']}
                                            helperText={errors['shipping_address.city']}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="State/Province"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            error={!!errors['shipping_address.state']}
                                            helperText={errors['shipping_address.state']}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="ZIP/Postal Code"
                                            name="zip_code"
                                            value={formData.zip_code}
                                            onChange={handleInputChange}
                                            error={!!errors['shipping_address.zip_code']}
                                            helperText={errors['shipping_address.zip_code']}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            error={!!errors['shipping_address.country']}
                                            helperText={errors['shipping_address.country']}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            {Object.values(cart.cart).map((item) => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 1,
                                    }}
                                >
                                    <Typography>
                                        {item.name} x {item.quantity}
                                    </Typography>
                                    <Typography>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                            ))}
                            <Divider sx={{ my: 2 }} />
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">
                                    ${cart.total.toFixed(2)}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                onClick={handleSubmit}
                            >
                                Place Order
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </MainLayout>
    );
};

export default Checkout; 