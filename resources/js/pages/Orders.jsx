import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    Divider,
} from '@mui/material';
import MainLayout from '../Layouts/MainLayout';
import { orderAPI } from '../services/api';
import ProductImage from '../components/ProductImage';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await orderAPI.get();
            setOrders(response.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (typeof price !== 'number') {
            return '0.00';
        }
        return price.toFixed(2);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Typography>Loading orders...</Typography>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Typography variant="h4" component="h1" gutterBottom>
                My Orders
            </Typography>
            {orders.length === 0 ? (
                <Card>
                    <CardContent>
                        <Typography variant="h6" align="center" gutterBottom>
                            No orders found
                        </Typography>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/products')}
                            >
                                Start Shopping
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {orders.map((order) => (
                        <Grid item xs={12} key={order.id}>
                            <Card>
                                <CardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 2,
                                        }}
                                    >
                                        <Typography variant="h6">
                                            Order #{order.id}
                                        </Typography>
                                        <Chip
                                            label={order.status}
                                            color={getStatusColor(order.status)}
                                        />
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Grid container spacing={2}>
                                        {order.products.map((product) => (
                                            <Grid item xs={12} key={product.id}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <ProductImage
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            width={50}
                                                            height={50}
                                                        />
                                                        <Box>
                                                            <Typography variant="subtitle1">
                                                                {product.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                Quantity: {product.pivot.quantity}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Typography>
                                                        ${formatPrice(product.pivot.price_at_time * product.pivot.quantity)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                    <Divider sx={{ my: 2 }} />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography variant="h6">Total</Typography>
                                        <Typography variant="h6">
                                            ${formatPrice(order.total_amount)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Shipping Address:
                                        </Typography>
                                        <Typography variant="body2">
                                            {order.shipping_address.street}
                                            <br />
                                            {order.shipping_address.city},{' '}
                                            {order.shipping_address.state}{' '}
                                            {order.shipping_address.zip_code}
                                            <br />
                                            {order.shipping_address.country}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </MainLayout>
    );
};

export default Orders; 