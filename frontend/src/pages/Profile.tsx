import useUser from '@/hooks/useUser';
import { Avatar, Box, Button, Container, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

// --- CONFIGURATION / MOCK DATA ---
const USER_DATA = {
  username: 'johndoe_official',
  fullName: 'John Doe',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  stats: {
    posts: 128,
    followers: '1.5k',
    following: 432,
  },
  bio: {
    category: 'Digital Creator 🎨',
    description: 'Building cool things with React & Node. 🚀',
    website: 'my-portfolio.com',
  },
};

// --- STYLES ---
const styles: Record<string, any> = {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    py: '3vh',
  },
  headerSection: (isMobile: boolean) => ({
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    mb: '4rem',
    gap: isMobile ? '2rem' : '10%',
    flexShrink: 0,
  }),
  avatar: {
    width: 'clamp(5rem, 22vw, 9.5rem)',
    height: 'clamp(5rem, 22vw, 9.5rem)',
    border: '0.06rem solid',
    borderColor: 'divider',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    mb: '1.5rem',
    gap: '1.2rem',
    flexWrap: 'wrap',
  },
  editButton: {
    bgcolor: 'grey.200',
    color: 'text.primary',
    textTransform: 'none',
    fontWeight: 600,
    px: '1.2rem',
    '&:hover': { bgcolor: 'grey.300' },
    boxShadow: 'none',
  },
  statsRow: {
    display: 'flex',
    gap: '2.5rem',
    mb: '1.5rem',
  },
  bioLink: {
    color: '#00376b',
    fontWeight: 600,
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  galleryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'min(3vw, 1.8rem)',
    overflowY: 'auto',
    flexGrow: 1,
    paddingBottom: '2rem',
    // Ensures items don't collapse or overlap
    alignContent: 'start',
    '&::-webkit-scrollbar': { width: '4px' },
    '&::-webkit-scrollbar-thumb': { borderRadius: '10px' },
  },
  postItem: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    bgcolor: 'grey.100',
    cursor: 'pointer',
    overflow: 'hidden',
    '&:hover img': { filter: 'brightness(0.85)' },
  },
  postImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.2s ease',
  },
};

type Post = {
  id: string;
  createdAt: Date;
  datedAt: Date;
  title: string;
  content: string;
  senderId: string;
};

type User = {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  email: string;
  isPrivate: boolean;
  postsCount: number;
  bio: string | null;
};

const ProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { getUserId, getUserPosts, getUserDetails } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (getUserId()) {
        const userPostsData = await getUserPosts(getUserId()!);
        setPosts(userPostsData);
        const userDetailsData = await getUserDetails(getUserId()!);
        setUser(userDetailsData);
      }
    };
    fetchUserData();
  }, [getUserId, getUserPosts, getUserDetails]);

  return (
    <Container maxWidth="md" sx={styles.pageWrapper}>
      <Box sx={styles.headerSection(isMobile)}>
        <Avatar src={/*user.avatarUrl ||*/ USER_DATA.avatarUrl} sx={styles.avatar} />

        <Box sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}>
          <Box sx={styles.actionRow}>
            <Typography variant="h6" sx={{ fontWeight: 400, fontSize: '1.25rem' }}>
              {user.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="contained" size="small" sx={styles.editButton}>
                Edit profile
              </Button>
              <IconButton size="small">
                <Settings size={22} strokeWidth={1.5} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={styles.statsRow}>
            <Typography sx={{ fontSize: '1rem' }}>
              <strong>{user.postsCount}</strong> posts
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary">
              {user.bio || 'No category'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* --- POSTS GALLERY --- */}
      <Box sx={styles.galleryContainer}>
        {posts.map((post, index) => (
          <Box key={index} sx={styles.postItem}>
            <Box component="img" src={post.content} sx={styles.postImg} />
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ProfilePage;
