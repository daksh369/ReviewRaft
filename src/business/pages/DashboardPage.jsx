import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  ButtonBase,
} from '@mui/material';
import {
  QrCode2 as QrCodeIcon,
  BarChart as AnalyticsIcon,
  AccountCircle as ProfileIcon,
  CreditCard as BillingIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DashboardButton = ({ icon, title, path }) => {
  const navigate = useNavigate();
  const IconComponent = icon;

  return (
    <Grid item xs={6}>
      <ButtonBase
        onClick={() => navigate(path)}
        sx={{
          width: '100%',
          height: '100%', // Ensure the button base takes full height
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            aspectRatio: '1 / 1', // Maintain a square aspect ratio
            borderRadius: '12px',
          }}
        >
          <IconComponent sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
            {title}
          </Typography>
        </Paper>
      </ButtonBase>
    </Grid>
  );
};

function DashboardPage() {
  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Manage your business reviews and settings.
            </Typography>
        </Box>

        <Grid container spacing={3} sx={{ maxWidth: '500px', width: '100%' }}>
            <DashboardButton
            icon={QrCodeIcon}
            title="QR Code"
            path="/business/your-qr-code" // This now points to the redirector
            />
            <DashboardButton
            icon={AnalyticsIcon}
            title="Analytics"
            path="/business/analytics"
            />
            <DashboardButton
            icon={ProfileIcon}
            title="Profile"
            path="/business/profile-settings"
            />
            <DashboardButton
            icon={BillingIcon}
            title="Subscription & Billing"
            path="/business/billing"
            />
        </Grid>
    </Container>
  );
}

export default DashboardPage;
