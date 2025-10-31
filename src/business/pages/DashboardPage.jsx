import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ReplyIcon from '@mui/icons-material/Reply';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

const menuItems = [
  {
    id: 'qr-code',
    title: 'Your QR Code',
    icon: <QrCode2Icon sx={{ fontSize: 40 }} />,
  },
  {
    id: 'auto-reply',
    title: 'Auto Reply Settings',
    icon: <ReplyIcon sx={{ fontSize: 40 }} />,
    path: 'auto-reply',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    path: 'analytics',
  },
  {
    id: 'profile-settings',
    title: 'Profile Settings',
    icon: <PersonOutlineIcon sx={{ fontSize: 40 }} />,
    path: 'profile-settings',
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [businessLink, setBusinessLink] = useState(null);

  useEffect(() => {
    const fetchBusinessLink = async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "business_links"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            setBusinessLink({ id: querySnapshot.docs[0].id, ...docData });
          }
        } catch (err) {
          setError('Failed to fetch business data. Please try again.');
          console.error("Error fetching business link: ", err);
        }
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
            fetchBusinessLink(user);
        } else {
            setLoading(false);
        }
    });

    return () => unsubscribe();
  }, []);

  const handleMenuItemClick = (item) => {
    if (item.id === 'qr-code') {
      if (businessLink) {
        navigate(`../your-qr-code/${businessLink.id}`);
      } else {
        navigate('../add-business-link');
      }
    } else {
       navigate(`../${item.path}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Manage your business reviews and settings.
      </Typography>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <Grid item xs={6} sm={6} md={6} key={item.title}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  height: '100%',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onClick={() => handleMenuItemClick(item)}
              >
                <Box sx={{ color: 'primary.main', mb: 1 }}>{item.icon}</Box>
                <Typography variant="h6" component="h2" align="center" sx={{fontSize: {xs: '1rem', sm: '1.25rem'}}}>
                  {item.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default DashboardPage;
