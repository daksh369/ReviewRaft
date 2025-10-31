import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ExitToApp } from '@mui/icons-material';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function BusinessNavbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/business/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" noWrap component={Link} to="/business/dashboard" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    ReviewQR
                </Typography>

                {/* Desktop View */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                    <IconButton component={Link} to="/business/dashboard" color="inherit" title="Dashboard">
                        <Home />
                    </IconButton>
                    {user ? (
                        <IconButton onClick={handleLogout} color="inherit" title="Logout">
                            <ExitToApp />
                        </IconButton>
                    ) : (
                        <Button component={Link} to="/business/signup" color="inherit">
                            Register
                        </Button>
                    )}
                </Box>
                
                {/* Mobile View */}
                 <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
                     <IconButton component={Link} to="/business/dashboard" color="inherit" title="Dashboard">
                        <Home />
                    </IconButton>
                    {user ? (
                        <IconButton onClick={handleLogout} color="inherit" title="Logout">
                            <ExitToApp />
                        </IconButton>
                    ) : (
                         <IconButton component={Link} to="/business/signup" color="inherit" title="Register">
                            <ExitToApp />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default BusinessNavbar;
