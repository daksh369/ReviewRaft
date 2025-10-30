import React from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    // Add signup logic here
    navigate('/business/login');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <QrCode2Icon sx={{ fontSize: 40, mr: 1, color: '#1A73E8' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            ReviewQR
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<LanguageIcon />}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            color: 'black',
            borderColor: 'grey.400',
          }}
        >
          EN
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 4,
        }}
      >
        <Box sx={{ my: 4 }}>
          <img src="https://i.imgur.com/3f5t6jS.png" alt="review" style={{ width: '100%', maxWidth: '300px' }} />
        </Box>
        <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }}>
          Create Your Account
        </Typography>
        <Typography component="p" sx={{ mt: 1, color: 'text.secondary' }}>
          Start collecting reviews in minutes.
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleSignup}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            Company Name
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="companyName"
            placeholder="Enter your company's name"
            name="companyName"
            autoFocus
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 2 }}>
            Contact Person
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="contactPerson"
            placeholder="Enter your full name"
            name="contactPerson"
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 2 }}>
            Email Address
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            placeholder="you@company.com"
            name="email"
            autoComplete="email"
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 2 }}>
            Password
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder="Enter a secure password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={<Checkbox value="allowExtraEmails" color="primary" />}
            label={
              <Typography variant="body2">
                I agree to the <Link href="#" sx={{ color: '#1A73E8', textDecoration: 'none' }}>Terms of Service</Link> and{' '}
                <Link href="#" sx={{ color: '#1A73E8', textDecoration: 'none' }}>Privacy Policy</Link>.
              </Typography>
            }
            sx={{ mt: 2, alignItems: 'flex-start' }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontSize: '1rem', borderRadius: '8px', backgroundColor: '#4285F4' }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link href="/business/login" variant="body2" sx={{ color: '#1A73E8', textDecoration: 'none' }}>
                  Log In
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