import React from 'react';
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  IconButton,
  InputAdornment,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LanguageIcon from '@mui/icons-material/Language';
import { Google as GoogleIcon } from '@mui/icons-material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    navigate('/business/add-business-link');
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
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
          mt: 8,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#1A73E8', width: 64, height: 64 }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 40 }}/>
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
          Welcome Back!
        </Typography>
        <Typography component="p" sx={{ mt: 1, color: 'text.secondary' }}>
          Log in to manage your business reviews.
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }} onSubmit={handleLogin}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            Email or Username
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            placeholder="Enter your email or username"
            name="email"
            autoComplete="email"
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mt: 2 }}>
            Password
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpenIcon />
                </InputAdornment>
              ),
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
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" sx={{ color: '#1A73E8', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5, textTransform: 'none', fontSize: '1rem', borderRadius: '8px', backgroundColor: '#1A73E8' }}
          >
            Login
          </Button>
          <Typography component="p" align="center" sx={{ my: 2, color: 'text.secondary' }}>
            or
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{ mb: 2, py: 1.5, textTransform: 'none', fontSize: '1rem', borderRadius: '8px', borderColor: 'grey.400', color: 'black' }}
          >
            Login with Google
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2">
                New to our service?{' '}
                <Link href="/business/signup" variant="body2" sx={{ color: '#1A73E8', textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;