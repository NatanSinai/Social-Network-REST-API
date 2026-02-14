import useAuth from '@/hooks/useAuth';
import { RoutePath } from '@/utils/routes';
import { Box, Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { signup, loginWithGoogle } = useAuth();

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setUsernameError(false);
    setEmailError(false);
    setPasswordError(false);

    const data = new FormData(event.currentTarget as HTMLFormElement);
    const username = data.get('username') as string;
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!username || !email || !password) {
      if (!username) setUsernameError(true);
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
      setError('Please fill in all fields.');
      return;
    }

    try {
      await signup(username, email, password);
      navigate(RoutePath.POSTS_FEED);
    } catch (error) {
      console.error('Sign up failed', error);
      setUsernameError(true);
      setEmailError(true);
      setPasswordError(true);
      setError('Sign up failed. Please try again.');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const credential = credentialResponse?.credential;
      if (!credential) {
        setError('Google login failed. Please try again.');
        return;
      }
      await loginWithGoogle(credential);
      navigate(RoutePath.POSTS_FEED);
    } catch (err) {
      console.error('Google signup error', err);
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                error={usernameError}
              />

              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={emailError}
              />

              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                error={passwordError}
              />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1, py: 1.5 }}>
                Sign Up
              </Button>

              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => setError('Google login failed. Please try again.')}
              />
            </Stack>

            {error && (
              <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component="button" type="button" variant="body2" onClick={() => navigate(RoutePath.LOGIN)}>
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
