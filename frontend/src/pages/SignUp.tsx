import { RoutePath } from '@/utils/routes';
import { Box, Button, Container, Link, Paper, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // TODO: ADD REGISTRATION LOGIC HERE
    console.log('Sign up logic placeholder', Object.fromEntries(data));
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
              <TextField required fullWidth id="username" label="Username" name="username" autoFocus />

              <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" />

              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 1, mb: 1, py: 1.5 }}>
                Sign Up
              </Button>
            </Stack>

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
