import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import CartItem from './CartItem';

const OrderSummary = ({
    items = [],
    subtotal = 0,
    shipping = 0,
    tax = 0,
    total = 0,
    onCheckout,
    showCheckoutButton = true,
    checkoutLabel = 'Proceed to Checkout',
    readOnly = false,
}) => {
    return (
        <Box sx={{ p: 3, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
                Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box>
                {items.length === 0 ? (
                    <Typography color="text.secondary">No items in order.</Typography>
                ) : (
                    items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            readOnly={true}
                            showActions={false}
                            showRemove={false}
                        />
                    ))
                )}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${typeof subtotal === 'number' ? subtotal.toFixed(2) : subtotal}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>${typeof shipping === 'number' ? shipping.toFixed(2) : shipping}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Tax</Typography>
                <Typography>${typeof tax === 'number' ? tax.toFixed(2) : tax}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">${typeof total === 'number' ? total.toFixed(2) : total}</Typography>
            </Box>
            {showCheckoutButton && !readOnly && (
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={onCheckout}
                >
                    {checkoutLabel}
                </Button>
            )}
        </Box>
    );
};

export default OrderSummary; 