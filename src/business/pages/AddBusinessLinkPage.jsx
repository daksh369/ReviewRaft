import React from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const steps = [
  { 
    primary: 'Search for your business on Google Search or Maps.',
  },
  { 
    primary: 'In your Business Profile, find the "Get more reviews" button and click it.',
  },
  { 
    primary: 'Copy the short URL provided.',
  },
];

function AddBusinessLinkPage() {
  const navigate = useNavigate();
  const [reviewLink, setReviewLink] = React.useState('');

  const handleNext = () => {
    if (reviewLink) {
      navigate(`/business/your-qr-code?reviewLink=${encodeURIComponent(reviewLink)}`);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#0D1117', minHeight: '100vh', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: '#161B22' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Add Your Business Link
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Find your review link
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
          Follow these steps to get a direct link for customers to review your business.
        </Typography>
        
        <List>
          {steps.map((step, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ color: '#1E88E5', fontSize: 24, minWidth: 40 }}>
                {index + 1}
              </ListItemIcon>
              <ListItemText primary={step.primary} />
            </ListItem>
          ))}
        </List>

        <Paper sx={{ p: 2, my: 4, backgroundColor: '#161B22', color: 'white' }}>
            <img src="https://i.imgur.com/5V36SIf.png" alt="Get more reviews" style={{ width: '100%', borderRadius: '8px' }} />
        </Paper>

        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Paste your Google review link
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="https://g.page/r/YourLinkHere"
          value={reviewLink}
          onChange={(e) => setReviewLink(e.target.value)}
          sx={{ 
            backgroundColor: '#161B22', 
            borderRadius: 1, 
            input: { color: 'white' } 
          }}
        />
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          sx={{ mt: 2, py: 1.5, textTransform: 'none', fontSize: '1rem', backgroundColor: '#1E88E5' }}
        >
          Next
        </Button>
      </Container>
    </Box>
  );
}

export default AddBusinessLinkPage;