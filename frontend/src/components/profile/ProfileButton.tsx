import { Avatar, IconButton } from '@mui/material';

const ProfileButton = ({ src, onClick, username }: { src: string; onClick?: () => void; username?: string }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'fixed',
      top: '2vh',
      right: '2vw',
      zIndex: 1200,
      width: { xs: 40, sm: 56 },
      height: { xs: 40, sm: 56 },
      p: 0,
      border: '2px solid white',
      boxShadow: 3,
    }}
  >
    <Avatar src={src} sx={{ width: '100%', height: '100%' }} alt={username || 'Profile Picture'} />
  </IconButton>
);
export default ProfileButton;
