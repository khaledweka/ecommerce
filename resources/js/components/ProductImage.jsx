import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';

const ProductImage = ({ 
    src, 
    alt, 
    width = 50, 
    height = 50,
    containerStyle = {},
    imageStyle = {}
}) => {
    const [imgError, setImgError] = useState(false);

    return (
        <Box
            sx={{
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                overflow: 'hidden',
                ...containerStyle
            }}
        >
            {!imgError && src ? (
                <img 
                    src={src}
                    alt={alt}
                    style={{ 
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        ...imageStyle
                    }}
                    onError={() => setImgError(true)}
                />
            ) : (
                <ImageIcon 
                    sx={{ 
                        color: '#bdbdbd',
                        fontSize: Math.min(width, height) * 0.6
                    }} 
                />
            )}
        </Box>
    );
};

export default ProductImage; 