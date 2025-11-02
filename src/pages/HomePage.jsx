import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography, Grid, Paper, Link, Stack } from '@mui/material';
import { QrCodeScanner, Speed, BarChart, AutoAwesome } from '@mui/icons-material';
import Pricing from '../components/Pricing';

const features = [
  {
    icon: <AutoAwesome fontSize="large" color="primary" />,
    title: 'AI-Powered Customer Reviews',
    description: 'Customers scan a QR code to instantly generate and post perfect reviews with AI assistance.',
  },
  {
    icon: <QrCodeScanner fontSize="large" color="primary" />,
    title: 'Effortless QR & Business Management',
    description: 'Create custom QR codes and manage all your business locations from one simple dashboard.',
  },
  {
    icon: <BarChart fontSize="large" color="primary" />,
    title: 'Actionable Customer Insights',
    description: 'Understand customer sentiment and track your online growth with our powerful analytics.',
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Turn Happy Customers into 5-Star Reviews.
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Effortlessly grow your online reputation with a simple QR code scan.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/business/signup')}>
          Boost Your Reviews Now!
        </Button>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: '#f5f7fa', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" fontWeight="bold" textAlign="center" sx={{ mb: 8 }}>
            How ReviewRaft Transforms Your Business
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} md={4} key={feature.title}>
                <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent' }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>{feature.title}</Typography>
                  <Typography color="text.secondary">{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Pricing />

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ textAlign: 'center', py: { xs: 8, md: 12 } }}>
        <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
          Ready to Elevate Your Reputation?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Start collecting 5-star reviews today and watch your business grow.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/business/signup')}>
          Get Started Now
        </Button>
      </Container>
      
      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            © {new Date().getFullYear()} ReviewRaft. All rights reserved.
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2}>
            <Link component={RouterLink} to="/privacy" color="text.secondary">
              Privacy Policy
            </Link>
            <Link component={RouterLink} to="/terms" color="text.secondary">
              Terms of Service
            </Link>
            <Link component={RouterLink} to="/contact" color="text.secondary">
              Contact Us
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
