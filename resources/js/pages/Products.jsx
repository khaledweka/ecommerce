import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Paper,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Visibility as ViewIcon,
    ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { productsAPI, cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ProductImage from '../components/ProductImage';

// Base64 encoded placeholder image (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productsAPI.getAll();
                console.log('Products API Response:', response.data);
                
                // Ensure we have an array of products
                const productsData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.data || [];
                
                setProducts(productsData);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.response?.data?.message || 'Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleViewDetails = (id) => {
        navigate(`/products/${id}`);
    };

    const handleAddToCart = async (id) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await cartAPI.addItem(id, 1);
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

    const columns = [
        { 
            field: 'image', 
            headerName: 'Image', 
            width: 100,
            renderCell: (params) => (
                <ProductImage 
                    src={params.value}
                    alt={params.row.name}
                    width={50}
                    height={50}
                />
            )
        },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'description', headerName: 'Description', width: 300 },
        { 
            field: 'price', 
            headerName: 'Price', 
            width: 120,
            valueFormatter: (params) => `$${params.value}`,
        },
        { 
            field: 'stock', 
            headerName: 'Stock', 
            width: 100,
            renderCell: (params) => (
                <Typography
                    color={params.value > 0 ? 'success.main' : 'error.main'}
                >
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="View Details">
                        <IconButton
                            onClick={() => handleViewDetails(params.row.id)}
                            size="small"
                        >
                            <ViewIcon />
                        </IconButton>
                    </Tooltip>
                    {isAuthenticated && (
                        <Tooltip title="Add to Cart">
                            <IconButton
                                onClick={() => handleAddToCart(params.row.id)}
                                size="small"
                                disabled={params.row.stock === 0}
                            >
                                <CartIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            ),
        },
    ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" align="center" gutterBottom>
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Products
            </Typography>
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={products}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                    loading={loading}
                    getRowId={(row) => row.id}
                    sx={{
                        '& .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                    }}
                />
            </Paper>
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
        </Container>
    );
};

export default Products; 