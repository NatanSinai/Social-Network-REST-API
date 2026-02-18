import { Avatar, IconButton } from '@mui/material';

const ProfileButton = ({ src, onClick, username }: { src?: string; onClick?: () => void; username?: string }) => (
  <IconButton
    onClick={onClick}
    sx={{
      width: { xs: 40, sm: 45 },
      height: { xs: 40, sm: 45 },
      p: 0,
      border: '2px solid',
      borderColor: 'white',
      overflow: 'hidden',
      '&:hover': {
        borderColor: 'primary.light',
        transform: 'scale(1.05)',
        transition: 'all 0.2s',
      },
    }}
  >
    <Avatar src={src} sx={{ width: '100%', height: '100%' }} alt={username || 'Profile Picture'} />
  </IconButton>
);
export default ProfileButton;
