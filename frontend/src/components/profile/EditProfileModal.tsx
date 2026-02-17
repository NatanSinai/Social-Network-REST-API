import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { Camera } from 'lucide-react';
import { useState } from 'react';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  currentUsername: string;
  currentAvatar: string;
  onSave: (newUsername: string, newAvatar: string) => void;
}

const modalStyles = {
  dialogPaper: {
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    p: 1,
  },
  avatarWrapper: {
    position: 'relative',
    alignSelf: 'center',
    cursor: 'pointer',
    '&:hover .overlay': { opacity: 1 },
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    bgcolor: 'rgba(0,0,0,0.4)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    opacity: 0,
    transition: 'opacity 0.2s ease',
  },
};

const EditProfileModal = ({ open, onClose, onSave, currentUsername, currentAvatar }: EditProfileModalProps) => {
  const [username, setUsername] = useState(currentUsername);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600 }}>Edit Profile</DialogTitle>

      <DialogContent>
        <Stack spacing={4} sx={{ mt: 2 }}>
          {/* Change Photo Section */}
          <Box sx={modalStyles.avatarWrapper}>
            <Avatar src={currentAvatar} sx={{ width: 100, height: 100, mx: 'auto' }} />
            <Box className='overlay' sx={modalStyles.overlay}>
              <Camera size={24} />
            </Box>
          </Box>

          {/* Username Input */}
          <TextField
            fullWidth
            label='Username'
            variant='outlined'
            defaultValue={currentUsername}
            placeholder='Enter username'
            onChange={(e) => setUsername(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color='inherit' sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(username, currentAvatar)}
          variant='contained'
          disableElevation
          sx={{ textTransform: 'none', px: 4, borderRadius: '8px' }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
