import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon, 
  Download as DownloadIcon, 
  Share as ShareIcon,
  Store as StoreIcon,
  Receipt as ReceiptIcon,
  TableRestaurant as TableRestaurantIcon
} from '@mui/icons-material';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { useLocation } from 'react-router-dom';

const usageSteps = [
    {
      icon: <StoreIcon />,
      primary: "Place at Counter",
      secondary: "Make it easy for customers at checkout.",
    },
    {
      icon: <ReceiptIcon />,
      primary: "Add to Receipts",
      secondary: "A reminder they can take with them.",
    },
    {
      icon: <TableRestaurantIcon />,
      primary: "Display on Tables",
      secondary: "Perfect for restaurants and cafes.",
    },
  ];

function YourQrCodePage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const reviewLink = queryParams.get('reviewLink') || "https://g.page/r/YourLinkHere";

    const downloadQRCode = () => {
        const canvas = document.getElementById('qrCodeEl');
        if (canvas) {
            const qrCodeURL = canvas.toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let aEl = document.createElement("a");
            aEl.href = qrCodeURL;
            aEl.download = "QR_Code.png";
            document.body.appendChild(aEl);
            aEl.click();
            document.body.removeChild(aEl);
        }
      }

  return (
    <Box sx={{ backgroundColor: '#0D1117', minHeight: '100vh', color: 'white' }}>
      <AppBar position="static" sx={{ backgroundColor: '#161B22' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Your QR Code
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Your QR Code is Ready!
        </Typography>
        <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary' }}>
          Here is your unique QR code for customers to leave reviews.
        </Typography>
        
        <Paper sx={{ p: 4, my: 4, backgroundColor: '#161B22', display: 'flex', justifyContent: 'center' }}>
            <QRCode id="qrCodeEl" value={reviewLink} size={256} fgColor="#FFFFFF" bgColor="#161B22" />
        </Paper>

        <Typography align="center" sx={{ color: 'text.secondary', mb: 2 }}>
          For review link: <Link href={reviewLink} target="_blank" rel="noopener">{reviewLink}</Link>
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadQRCode}
              sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', backgroundColor: '#1E88E5' }}
            >
              Download
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ShareIcon />}
              sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', borderColor: '#1E88E5', color: '#1E88E5' }}
            >
              Share
            </Button>
          </Grid>
        </Grid>

        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
          How to Use Your QR Code
        </Typography>

        <List>
          {usageSteps.map((step, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ color: '#1E88E5' }}>
                {step.icon}
              </ListItemIcon>
              <ListItemText primary={step.primary} secondary={step.secondary} />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
}

export default YourQrCodePage;