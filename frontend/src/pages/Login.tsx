import useAuth from '@/hooks/useAuth';
import { RoutePath } from '@/utils/routes';
import { Box, Button, Container, Link, Paper, TextField, Typography } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useState, type FC, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setUsernameError(false);
    setPasswordError(false);

    const data = new FormData(event.currentTarget as HTMLFormElement);

    try {
      await login(data.get('username') as string, data.get('password') as string);
      navigate(RoutePath.POSTS_FEED);
    } catch (err) {
      console.error('Login failed', err);
      setUsernameError(true);
      setPasswordError(true);
      setError('Invalid username or password. Please try again.');
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
      console.error('Google login error', err);
      setError('Google login failed. Please try again.');
    }
  };

  return (
    <Container component='main' maxWidth='xs' sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%', borderRadius: 2 }}>
          <Typography component='h1' variant='h5' align='center' gutterBottom>
            Sign In
          </Typography>
          <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoFocus
              error={usernameError}
            />

            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              error={passwordError}
            />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2, py: 1.5 }}>
              Log In
            </Button>

            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setError('Google login failed. Please try again.')}
            />

            {error && (
              <Typography color='error' variant='body2' align='center' sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link component='button' type='button' variant='body2' onClick={() => navigate(RoutePath.SIGNUP)}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
