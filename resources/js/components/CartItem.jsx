import React from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ProductImage from './ProductImage';

const CartItem = ({
    item,
    onIncrease,
    onDecrease,
    onRemove,
    showActions = true,
    showRemove = true,
    readOnly = false,
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
            <ProductImage src={item.image_url} alt={item.name} width={60} height={60} />
            <Box sx={{ flex: 1, ml: 2 }}>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price} each
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                </Typography>
            </Box>
            <Box sx={{ minWidth: 120, textAlign: 'right' }}>
                <Typography variant="subtitle1">
                    ${typeof item.price === 'number' ? (item.price * item.quantity).toFixed(2) : item.price}
                </Typography>
                {showActions && !readOnly && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'flex-end' }}>
                        <IconButton size="small" onClick={() => onDecrease(item.id)} disabled={item.quantity <= 1}>
                            <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => onIncrease(item.id)}>
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
                {showRemove && !readOnly && (
                    <IconButton color="error" onClick={() => onRemove(item.id)}>
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};

export default CartItem; 