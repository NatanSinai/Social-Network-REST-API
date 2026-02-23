import { queryKeys } from '@/api/queryKeys';
import { getUser } from '@/api/user';
import { useAuthContext } from '@/providers/AuthProvider';
import { RoutePath } from '@/utils/routes';
import { ProfileButton } from '@components';
import { envVar } from '@env';
import { AppBar, Box, Button, Container, Toolbar, Tooltip, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { useNavigate } from 'react-router-dom';

export type NavbarProps = {};

export const Navbar: FC<NavbarProps> = () => {
  const { logout, userId } = useAuthContext();
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: queryKeys.users.specific(userId!),
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });

  const handleLogout = async () => {
    await logout();
    navigate(RoutePath.LOGIN);
  };

  const profilePictureURL = user?.profilePictureURL ? `${envVar.VITE_BACKEND_URL}${user.profilePictureURL}` : undefined;

  return (
    <AppBar
      position='sticky'
      elevation={0}
      sx={{
        bgcolor: 'primary.main',
        color: 'secondary.main',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{
            justifyContent: 'space-between',
            minHeight: { xs: '60px', sm: '70px' },
          }}
        >
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '1.2rem', sm: '1.5rem' },
              letterSpacing: '-0.5px',
            }}
            onClick={() => navigate(RoutePath.POSTS_FEED)}
          >
            SocialNetwork
          </Typography>

          <Box sx={{ display: 'flex', gap: { xs: 1, sm: 2 }, alignItems: 'center' }}>
            <Button
              color='secondary'
              onClick={() => navigate(RoutePath.POSTS_FEED)}
              sx={{ textTransform: 'none', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
            >
              Feed
            </Button>

            {userId ? (
              <>
                <Tooltip arrow title='View Profile'>
                  <Box>
                    <ProfileButton
                      src={profilePictureURL}
                      username={user?.username}
                      onClick={() => navigate(RoutePath.PROFILE)}
                    />
                  </Box>
                </Tooltip>

                <Button
                  variant='contained'
                  color='error'
                  onClick={handleLogout}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 2,
                    px: { xs: 1.5, sm: 3 },
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    fontWeight: 600,
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant='contained'
                color='secondary'
                onClick={() => navigate(RoutePath.LOGIN)}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
