import React from 'react';
import { Container, Typography } from '@mui/material';

function SignupPage_Test() {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4">Signup Page Test</Typography>
      <Typography variant="body1">This page is rendering correctly.</Typography>
    </Container>
  );
}

export default SignupPage_Test;
