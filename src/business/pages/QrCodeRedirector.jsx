import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Box, CircularProgress, Typography } from '@mui/material';

function QrCodeRedirector() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const findBusinessLink = () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const businessQuery = query(collection(db, "business_links"), where("userId", "==", user.uid));
            const businessSnapshot = await getDocs(businessQuery);
            
            if (!businessSnapshot.empty) {
              const businessDoc = businessSnapshot.docs[0];
              const businessData = businessDoc.data();
              
              // **THE FIX IS HERE:** Check if a placeId exists
              if (businessData.placeId) {
                // If we have a placeId, the QR code is set up. Go to the viewer.
                navigate(`/business/your-qr-code/${businessDoc.id}`, { replace: true });
              } else {
                // If there's no placeId, the user needs to set their location first.
                navigate('/business/add-business-link', { replace: true });
              }
            } else {
              // This case handles users who signed up but somehow failed to create a business doc.
              navigate('/business/add-business-link', { replace: true });
            }
          } catch (err) {
            console.error("Error finding business link:", err);
            setError("Could not retrieve your business information. Please try again.");
          }
        } else {
          // If not logged in, go to login page.
          navigate('/business/login', { replace: true });
        }
      });
      
      return () => unsubscribe();
    };

    findBusinessLink();
  }, [navigate]);

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="80vh"
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Finding your QR Code...</Typography>
    </Box>
  );
}

export default QrCodeRedirector;