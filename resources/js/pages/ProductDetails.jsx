import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    Grid,
    Paper,
    CircularProgress,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import MainLayout from '../Layouts/MainLayout';
import { productsAPI, cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ProductImage from '../components/ProductImage';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await productsAPI.getById(id);
            setProduct(response.data);
        } catch (err) {
            console.error('Error fetching product:', err);
            setError(err.response?.data?.message || 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await cartAPI.addItem(id, quantity);
            setSnackbar({
                open: true,
                message: 'Product added to cart successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Failed to add product to cart',
                severity: 'error'
            });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value);
        if (value > 0 && value <= product.stock) {
            setQuantity(value);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Container>
                    <Typography color="error" align="center" gutterBottom>
                        {error}
                    </Typography>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/products')}
                        >
                            Back to Products
                        </Button>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    if (!product) {
        return (
            <MainLayout>
                <Container>
                    <Typography align="center" gutterBottom>
                        Product not found
                    </Typography>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/products')}
                        >
                            Back to Products
                        </Button>
                    </Box>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Container sx={{ py: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ProductImage
                                src={product.image_url}
                                alt={product.name}
                                width={400}
                                height={400}
                                containerStyle={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    backgroundColor: 'white'
                                }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {product.name}
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom>
                                ${product.price}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {product.description}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                                Stock: {product.stock}
                            </Typography>
                            {product.stock > 0 ? (
                                <Box sx={{ mt: 3 }}>
                                    <TextField
                                        type="number"
                                        label="Quantity"
                                        value={quantity}
                                        onChange={handleQuantityChange}
                                        inputProps={{ min: 1, max: product.stock }}
                                        sx={{ width: 100, mr: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CartIcon />}
                                        onClick={handleAddToCart}
                                        disabled={!isAuthenticated}
                                    >
                                        Add to Cart
                                    </Button>
                                </Box>
                            ) : (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    Out of Stock
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
};

export default ProductDetails; 