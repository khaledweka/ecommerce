import React, { useState } from 'react';
import {
    Box,
    Typography,
    Slider,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Button,
    Divider,
    IconButton,
    Drawer,
    useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';

const ProductFilters = ({
    open,
    onClose,
    filters,
    onChange,
    onApply,
    onClear,
    categories = [],
}) => {
    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));
    const [localFilters, setLocalFilters] = useState(filters);

    const handleSliderChange = (event, newValue) => {
        setLocalFilters({ ...localFilters, price: newValue });
    };

    const handleCategoryChange = (category) => {
        let newCategories = [...localFilters.categories];
        if (category === 'all') {
            if (newCategories.includes('all')) {
                newCategories = [];
            } else {
                newCategories = ['all'];
            }
        } else {
            newCategories = newCategories.filter((c) => c !== 'all');
            if (newCategories.includes(category)) {
                newCategories = newCategories.filter((c) => c !== category);
            } else {
                newCategories.push(category);
            }
        }
        setLocalFilters({ ...localFilters, categories: newCategories });
    };

    const handleApply = () => {
        onChange(localFilters);
        onApply && onApply();
    };

    const handleClear = () => {
        setLocalFilters({ price: [0, 300], categories: ['all'] });
        onClear && onClear();
    };

    const allSelected = localFilters.categories.length === 1 && localFilters.categories[0] === 'all';

    const filterContent = (
        <Box sx={{ width: 280, p: 3, position: 'relative' }}>
            <IconButton
                onClick={onClose}
                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                size="small"
            >
                <CloseIcon />
            </IconButton>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>Price</Typography>
                <Slider
                    value={localFilters.price}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={300}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>${localFilters.price[0]}</span>
                    <span>${localFilters.price[1]}</span>
                </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom>Category</Typography>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={allSelected}
                            onChange={() => handleCategoryChange('all')}
                            disabled={false}
                        />
                    }
                    label="All"
                />
                {categories.map((cat) => (
                    <FormControlLabel
                        key={cat.value}
                        control={
                            <Checkbox
                                checked={localFilters.categories.includes(cat.value)}
                                onChange={() => handleCategoryChange(cat.value)}
                                disabled={allSelected}
                            />
                        }
                        label={cat.label}
                    />
                ))}
            </FormGroup>
            <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3, mb: 1 }}
                onClick={handleApply}
            >
                Apply Filter
            </Button>
            <Button
                variant="text"
                color="inherit"
                fullWidth
                sx={{ color: 'text.secondary' }}
                onClick={handleClear}
            >
                Clear all filters
            </Button>
        </Box>
    );

    return isMobile ? (
        <Drawer anchor="left" open={open} onClose={onClose}>
            {filterContent}
        </Drawer>
    ) : (
        <Box sx={{ minWidth: 280, maxWidth: 320, borderRight: '1px solid #eee', height: '100vh', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
            {filterContent}
        </Box>
    );
};

export default ProductFilters; 