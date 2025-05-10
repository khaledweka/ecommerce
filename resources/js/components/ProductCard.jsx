import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import ProductImage from './ProductImage';

const ProductCard = ({
    product,
    onViewDetails,
    onAddToCart,
    showAddToCart = true,
    showStock = true,
    showCategory = true,
    addToCartDisabled = false,
}) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
                <ProductImage
                    src={product.image ? `/storage/${product.image}` : undefined}
                    alt={product.name}
                    width={150}
                    height={150}
                />
            </Box>
            <CardContent>
                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                {showCategory && product.category && (
                    <Chip label={product.category} size="small" sx={{ mb: 1 }} />
                )}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price}
                </Typography>
                {showStock && (
                    <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                        Stock: {product.stock}
                    </Typography>
                )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button size="small" variant="outlined" onClick={() => onViewDetails(product.id)}>
                    View Details
                </Button>
                {showAddToCart && (
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => onAddToCart(product.id)}
                        disabled={addToCartDisabled || product.stock === 0}
                    >
                        Add to Cart
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default ProductCard; 