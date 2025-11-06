import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function TermsOfServicePage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Terms of Service
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Content for the Terms of Service page will be added here later.
        </Typography>
      </Box>
    </Container>
  );
}

export default TermsOfServicePage;
