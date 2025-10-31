import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function that we can use for cleanup.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // When the component unmounts, we want to unsubscribe from the listener
    // to prevent memory leaks.
    return () => unsubscribe();
  }, []);

  // While we are waiting for the auth state to be confirmed,
  // we can show a loading spinner.
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Once loading is false, if there is no user, we redirect to the login page.
  if (!user) {
    return <Navigate to="/business/login" replace />;
  }

  // If there is a user, we render the protected component.
  return children;
};

export default ProtectedRoute;
