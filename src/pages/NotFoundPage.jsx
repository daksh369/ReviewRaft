import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
      <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" size="large" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Container>
  );
}

export default NotFoundPage;
