import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Paper,
    Snackbar,
    Alert,
    Grid,
    IconButton,
    useMediaQuery,
    TextField,
    InputAdornment,
    Pagination,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { productsAPI, cartAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const defaultFilters = {
    price: [0, 300],
    categories: ['all'],
};

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [filters, setFilters] = useState(defaultFilters);
    const [filterOpen, setFilterOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchProducts(currentPage);
        // eslint-disable-next-line
    }, [currentPage]);

    const fetchProducts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await productsAPI.getAll(page);
            // Laravel pagination: response.data.data, response.data.current_page, response.data.last_page
            const productsData = Array.isArray(response.data)
                ? response.data
                : response.data.data || [];
            setProducts(productsData);
            setCurrentPage(response.data.current_page || 1);
            setTotalPages(response.data.last_page || 1);
            // Extract unique categories from products
            const uniqueCategories = Array.from(
                new Set(productsData.map(p => p.category).filter(Boolean))
            ).map(cat => ({ label: cat, value: cat }));
            setCategories(uniqueCategories);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/products/${id}`);
    };

    const handleAddToCart = async (id) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
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

    // Filtering logic (client-side for now)
    const filteredProducts = products.filter((product) => {
        // Price filter
        const inPriceRange = product.price >= filters.price[0] && product.price <= filters.price[1];
        // Category filter
        const inCategory =
            filters.categories.includes('all') ||
            (product.category && filters.categories.includes(product.category));
        // Keyword filter
        const keyword = search.trim().toLowerCase();
        const inKeyword =
            !keyword ||
            (product.name && product.name.toLowerCase().includes(keyword)) ||
            (product.description && product.description.toLowerCase().includes(keyword));
        return inPriceRange && inCategory && inKeyword;
    });

    return (
        <Container sx={{ py: 4, maxWidth: 'xl' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {isMobile && (
                    <IconButton onClick={() => setFilterOpen(true)} sx={{ mr: 1 }}>
                        <FilterListIcon />
                    </IconButton>
                )}
                <Typography variant="h4" component="h1" gutterBottom sx={{ flexGrow: 1 }}>
                    Products
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search by product name or description"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    sx={{ minWidth: 220, background: '#fff', borderRadius: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Box sx={{ display: 'flex' }}>
                {/* Sidebar for desktop, Drawer for mobile */}
                {!isMobile && (
                    <ProductFilters
                        open={true}
                        onClose={() => setFilterOpen(false)}
                        filters={filters}
                        onChange={setFilters}
                        onApply={() => {}}
                        onClear={() => setFilters(defaultFilters)}
                        categories={categories}
                    />
                )}
                {isMobile && (
                    <ProductFilters
                        open={filterOpen}
                        onClose={() => setFilterOpen(false)}
                        filters={filters}
                        onChange={setFilters}
                        onApply={() => setFilterOpen(false)}
                        onClear={() => setFilters(defaultFilters)}
                        categories={categories}
                    />
                )}
                <Box sx={{ flex: 1, ml: !isMobile ? 3 : 0 }}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" align="center" gutterBottom>
                            {error}
                        </Typography>
                    ) : (
                        <>
                        <Grid container spacing={3}>
                            {filteredProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                    <ProductCard
                                        product={product}
                                        onViewDetails={handleViewDetails}
                                        onAddToCart={handleAddToCart}
                                        addToCartDisabled={!isAuthenticated}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Box display="flex" justifyContent="center" mt={4}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(_, page) => setCurrentPage(page)}
                                color="primary"
                                shape="rounded"
                            />
                        </Box>
                        </>
                    )}
                </Box>
            </Box>
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