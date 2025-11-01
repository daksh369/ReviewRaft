import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { Home, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const BusinessNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.signOut();
        navigate('/business/login');
    };
    
    const handleHome = () => {
        navigate('/business/dashboard');
    }

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                <Typography 
                    variant="h4" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        fontFamily: "'Italianno', cursive",
                        fontWeight: 'bold',
                    }}
                >
                    ReviewRaft
                </Typography>
                <Box>
                    <IconButton color="inherit" onClick={handleHome}>
                        <Home />
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <ExitToApp />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default BusinessNavbar;