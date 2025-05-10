import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Container,
} from '@mui/material';
import MainLayout from '../Layouts/MainLayout';
import { ordersAPI } from '../services/api';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const response = await ordersAPI.getById(id);
            setOrder(response.data);
        } catch (error) {
            setError('Failed to load order details');
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Typography>Loading order details...</Typography>
            </MainLayout>
        );
    }

    if (error || !order) {
        return (
            <MainLayout>
                <Typography color="error">{error || 'Order not found'}</Typography>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container>
                <Box sx={{ mb: 3 }}>
                    <Button component={Link} to="/orders" variant="outlined">
                        Back to Orders
                    </Button>
                </Box>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Order #{order.id}
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Shipping Information
                            </Typography>
                            <Typography>
                                {order.shipping_address.street}
                                <br />
                                {order.shipping_address.city},{' '}
                                {order.shipping_address.state}{' '}
                                {order.shipping_address.zip_code}
                                <br />
                                {order.shipping_address.country}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Order Status
                            </Typography>
                            <Typography
                                color={
                                    order.status === 'completed'
                                        ? 'success.main'
                                        : order.status === 'cancelled'
                                        ? 'error.main'
                                        : 'warning.main'
                                }
                            >
                                {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider sx={{ my: 3 }} />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell align="right">
                                            ${item.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell align="right">
                                            $
                                            {(item.price * item.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} align="right">
                                        <Typography variant="h6">Total</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="h6">
                                            ${order.total.toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </MainLayout>
    );
};

export default OrderDetails; 