/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPostsBySenderId } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import { getUser, getUserId, updateUserDetails } from '@/api/user';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const styles: Record<string, any> = {
  pageWrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    py: '3vh',
  },
  headerSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    mb: '4rem',
    gap: '10%',
    flexShrink: 0,
  },
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

const ProfilePage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userId = useMemo(() => getUserId(), []);

  const { data: postsData } = useInfiniteQuery({
    queryKey: queryKeys.posts.sender(userId!),
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getPostsBySenderId(userId!, pageParam, 10),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined),
  });

  const posts = postsData?.pages.flatMap(({ posts }) => posts);

  const { data: userData } = useInfiniteQuery({
    queryKey: queryKeys.users.specific(userId!),
    initialPageParam: 1,
    queryFn: () => getUser(userId!),
    getNextPageParam: () => undefined,
  });

  const user = userData?.pages[0];

  const handleEditProfile = async (username: string, profilePictureURL: string) => {
    try {
      await updateUserDetails(getUserId()!, { username, profilePictureURL });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Container maxWidth='md' sx={styles.pageWrapper}>
      <Box sx={styles.headerSection}>
        <Avatar src={user?.profilePictureURL} sx={styles.avatar} />

        <Box sx={{ flex: 1, width: 'auto' }}>
          <Box sx={styles.actionRow}>
            <Typography variant='h6' sx={{ color: 'black' }}>
              {user?.username}
            </Typography>
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant='contained' size='small' onClick={() => setIsEditModalOpen(true)}>
                Edit profile
              </Button>
            </Box>
          </Box>

          <Box sx={styles.statsRow}>
            <Typography sx={{ fontSize: '1rem' }}>
              <strong>{user?.postCount || 0}</strong> posts
            </Typography>
          </Box>

          <Box>
            <Typography variant='body2' color='text.secondary'>
              {user?.bio || 'No Bio'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={styles.galleryContainer}>
        {posts?.map((post, index) => (
          <Box key={index} sx={styles.postItem}>
            <Box component='img' src={post.imageURL} sx={styles.postImg} />
          </Box>
        ))}
      </Box>

      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProfile}
        currentUsername={user?.username || ''}
        currentAvatar={user?.profilePictureURL || ''}
      />
    </Container>
  );
};

export default ProfilePage;
