import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, Button, Paper, Grid, Container } from '@mui/material';
import { Check } from '@mui/icons-material';

const pricingTiers = [
  {
    title: 'Basic',
    price: '₹100',
    features: ['1 Business Location', '1,000 Review Generations / mo', '10,000 Analytics Views / mo', 'Basic Analytics'],
  },
  {
    title: 'Pro',
    price: '₹120',
    features: ['5 Business Locations', '5,000 Review Generations / mo', '50,000 Analytics Views / mo', 'Advanced Analytics w/ Trends'],
    highlight: true,
  },
  {
    title: 'Ultra',
    price: '₹150',
    features: ['Unlimited Locations', 'Unlimited Review Generations', 'Unlimited Analytics Views', 'Premium Analytics w/ Trends'],
  },
];

const Pricing = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fa', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
            <Typography variant="h4" component="h2" fontWeight="bold" textAlign="center" sx={{ mb: 8 }}>
                Simple Pricing for Every Business
            </Typography>
            <Box sx={{ overflow: 'hidden', mx: -2 }}>
              <Slider {...settings}>
                {pricingTiers.map((tier) => (
                  <Box key={tier.title} sx={{ px: 2, height: '100%' }}>
                    <Paper 
                      elevation={tier.highlight ? 5 : 2} 
                      sx={{ 
                        p: 4, 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        height: '100%',
                        border: tier.highlight ? 2 : 0,
                        borderColor: 'primary.main',
                      }}
                    >
                      <Box>
                        <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                          {tier.title}
                        </Typography>
                        <Typography variant="h4" component="p" fontWeight="bold">
                          {tier.price}
                          <Typography component="span" color="text.secondary" sx={{ ml: 0.5 }}>/ month</Typography>
                        </Typography>
                      </Box>
                      <Box sx={{ my: 3, textAlign: 'left' }}>
                        {tier.features.map((feature) => (
                          <Grid container spacing={1} key={feature} sx={{ alignItems: 'center', mb: 1 }}>
                            <Grid item xs="auto">
                              <Check color="primary" />
                            </Grid>
                            <Grid item xs>
                              <Typography>{feature}</Typography>
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                      <Button variant={tier.highlight ? "contained" : "outlined"} fullWidth>
                        Get Started
                      </Button>
                    </Paper>
                  </Box>
                ))}
              </Slider>
            </Box>
        </Container>
    </Box>
  );
};

export default Pricing;