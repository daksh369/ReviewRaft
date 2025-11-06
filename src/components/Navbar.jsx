import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';

function Navbar() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <QrCode2Icon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              fontFamily: "'Italianno', cursive",
              fontSize: '2.5rem'
            }}
          >
            ReviewRaft
          </Typography>
        </Link>
        <Box>
          <Button color="inherit" onClick={() => navigate('/business/login')}>
            Log In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;