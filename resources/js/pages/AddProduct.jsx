import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    MenuItem,
    Paper,
    Snackbar,
    Alert,
    InputAdornment,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';

const categories = [
    { label: 'T-shirts', value: 'T-shirts' },
    { label: 'Polo', value: 'Polo' },
    { label: 'Jeans', value: 'Jeans' },
    { label: 'Shirts', value: 'Shirts' },
];

const AddProduct = () => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            await productsAPI.create(formData);
            setSnackbar({ open: true, message: 'Product created successfully!', severity: 'success' });
            setTimeout(() => navigate('/products'), 1200);
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.message || 'Failed to create product', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Add New Product
                </Typography>
                <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
                    <TextField
                        label="Product Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        minRows={3}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Price"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                        InputProps={{
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Stock"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        label="Category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.value} value={cat.value}>
                                {cat.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        Upload Image
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            hidden
                            onChange={handleChange}
                        />
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Add Product'}
                    </Button>
                </Box>
            </Paper>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddProduct; 