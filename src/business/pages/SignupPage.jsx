import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc, addDoc, collection, updateDoc } from "firebase/firestore"; 
import { generateHighlightTabs } from '../../ai/generative'; // Import the AI function

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Step 1: Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Update their profile
      await updateProfile(user, {
        displayName: fullName,
      });

      // Step 3: Create a user document
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fullName: fullName,
        createdAt: new Date()
      });
      
      // Step 4: Create the business document (without tabs first)
      const docRef = await addDoc(collection(db, "business_links"), {
          userId: user.uid,
          businessName: businessName,
          description: businessDescription,
          createdAt: new Date(),
      });
      
      // Step 5: Generate AI tabs using the business description
      const tabs = await generateHighlightTabs(businessDescription);
      
      // Step 6: Update the new business document with the generated tabs
      await updateDoc(docRef, {
        highlightTabs: tabs
      });

      // Step 7: Navigate to the dashboard page
      navigate('/business/dashboard');

    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate('/business/add-business-link');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <QrCode2Icon sx={{ fontSize: 40, mr: 1, color: '#1A73E8' }} />
        <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
                fontFamily: "'Italianno', cursive",
                fontWeight: 'bold',
            }}
        >
            ReviewRaft
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 2,
      }}>
        <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          Create an account
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Get started by creating your user profile and business page.
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSignup} noValidate sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Your Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            InputProps={{ sx: { borderRadius: '8px', fontSize: '1.1rem' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="businessName"
            label="Business Name"
            name="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            InputProps={{ sx: { borderRadius: '8px', fontSize: '1.1rem' } }}
          />
           <TextField
            margin="normal"
            required
            fullWidth
            id="businessDescription"
            label="Business Description"
            name="businessDescription"
            multiline
            rows={3}
            placeholder="e.g., A cozy cafe serving artisanal coffee and pastries."
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            InputProps={{ sx: { borderRadius: '8px', fontSize: '1.1rem' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ sx: { borderRadius: '8px', fontSize: '1.1rem' } }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: { borderRadius: '8px', fontSize: '1.1rem' },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontSize: '1.1rem', borderRadius: '8px', backgroundColor: '#4285F4' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account & Continue'}
          </Button>
          {/* <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mb: 2, py: 1.5, textTransform: 'none', fontSize: '1.1rem', borderRadius: '8px', borderColor: 'grey.400', color: 'black' }}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Sign up with Google
          </Button> */}
          <Grid container justifyContent="center">
            <Grid item>
               <Typography variant="body2">
                Already have an account?{' '}
                <Link href="/business/login" variant="body2" sx={{ color: '#1A73E8', textDecoration: 'none' }}>
                  Login here
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignupPage;
