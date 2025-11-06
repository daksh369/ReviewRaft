import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function PrivacyPolicyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Box sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Content for the Privacy Policy page will be added here later.
        </Typography>
      </Box>
    </Container>
  );
}

export default PrivacyPolicyPage;