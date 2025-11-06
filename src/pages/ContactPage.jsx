import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { LocationOn, Phone, Email } from '@mui/icons-material';

const contactDetails = [
  {
    icon: <LocationOn color="primary" />,
    primary: 'Our Office',
    secondary: '123 Business Avenue, Suite 100, Tech City, 12345',
  },
  {
    icon: <Phone color="primary" />,
    primary: 'Call Us',
    secondary: '+91 123 456 7890',
  },
  {
    icon: <Email color="primary" />,
    primary: 'Email Us',
    secondary: 'support@reviewraft.com',
  },
];

function ContactPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
      <Typography variant="h3" component="h1" fontWeight="bold" textAlign="center" gutterBottom>
        Get in Touch
      </Typography>
      <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 8 }}>
        Have questions? We're here to help.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* Contact Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
              Contact Information
            </Typography>
            <List>
              {contactDetails.map((detail) => (
                <ListItem key={detail.primary} disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon>{detail.icon}</ListItemIcon>
                  <ListItemText primary={detail.primary} secondary={detail.secondary} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ContactPage;