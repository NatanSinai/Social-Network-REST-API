/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPostsBySenderId } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import { getUser, updateUserDetails } from '@/api/user';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { useAuthContext } from '@/providers/AuthProvider';
import { envVar } from '@/utils/env';
import { GenericDialog } from '@components';
import { Avatar, Box, Button, Container, Typography } from '@mui/material';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

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
  statsRow: {
    display: 'flex',
    gap: '2.5rem',
    mb: '1.5rem',
  },
  galleryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'min(3vw, 1.8rem)',
    overflowY: 'auto',
    flexGrow: 1,
    paddingBottom: '2rem',
    alignContent: 'start',
    '&::-webkit-scrollbar': { width: '4px' },
    '&::-webkit-scrollbar-thumb': { borderRadius: '10px', bgcolor: 'grey.300' },
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
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();

  const { data: postsData } = useInfiniteQuery({
    queryKey: queryKeys.posts.sender(userId!),
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getPostsBySenderId(userId!, pageParam, 10),
    getNextPageParam: (lastPage: any) => (lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined),
    enabled: !!userId,
  });

  const posts = postsData?.pages.flatMap((page: any) => page.posts) || [];

  const { data: user } = useQuery({
    queryKey: queryKeys.users.specific(userId!),
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });

  const handleEditProfile = async (values: { username: string; image?: File | string | undefined }) => {
    try {
      await updateUserDetails(userId!, {
        username: values.username,
        // Only send image if the user picked a new File — ignore the existing URL string
        image: values.image instanceof File ? values.image : undefined,
      });

      await queryClient.invalidateQueries({ queryKey: queryKeys.users.specific(userId!) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.posts.sender(userId!) });

      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <Container maxWidth='md' sx={styles.pageWrapper}>
      <Box sx={styles.headerSection}>
        <Avatar
          src={user?.profilePictureURL ? `${envVar.VITE_BACKEND_URL}${user.profilePictureURL}` : undefined}
          sx={styles.avatar}
        />

        <Box sx={{ flex: 1, width: 'auto' }}>
          <Box sx={styles.actionRow}>
            <Typography variant='h6' sx={{ color: 'black' }}>
              {user?.username || 'Loading...'}
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
        {posts.map((post: any, index: number) => (
          <Box key={post.id || index} sx={styles.postItem}>
            <Box component='img' src={post.imageURL} sx={styles.postImg} />
          </Box>
        ))}
      </Box>

      <GenericDialog isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title='Edit Profile'>
        <EditProfileForm
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProfile}
          defaultValues={{
            username: user?.username,
            image: user?.profilePictureURL
              ? `${envVar.VITE_BACKEND_URL}${user.profilePictureURL}`
              : undefined,
          }}
        />
      </GenericDialog>
    </Container>
  );
};

export default ProfilePage;
