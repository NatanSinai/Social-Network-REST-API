/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPostsBySenderId } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import { getUser, updateUserDetails } from '@/api/user';
import EditProfileForm from '@/components/profile/EditProfileForm';
import { useInfiniteScroll } from '@/hooks';
import { useAuthContext } from '@/providers/AuthProvider';
import { envVar } from '@/utils/env';
import { GenericDialog, PostView } from '@components';
import { Avatar, Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
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
    overflowY: 'auto',
    flexGrow: 1,
    paddingBottom: '2rem',
    alignContent: 'start',
    '&::-webkit-scrollbar': { width: 0 },
    width: '100%',
  },
};

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.posts.sender(userId!),
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getPostsBySenderId(userId!, pageParam, 10),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined),
    enabled: !!userId,
  });

  const loadMoreRef = useInfiniteScroll({ callback: fetchNextPage, isEnabled: hasNextPage && !isFetchingNextPage });
  const posts = postsData?.pages.flatMap((page) => page.posts) || [];

  const { data: user } = useQuery({
    queryKey: queryKeys.users.specific(userId!),
    queryFn: () => getUser(userId!),
    enabled: !!userId,
  });

  const handleEditProfile = async (values: { username: string; image?: File | string | undefined }) => {
    try {
      await updateUserDetails(userId!, {
        username: values.username,
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
        </Box>
      </Box>

      <Stack sx={styles.galleryContainer} alignItems='center'>
        <Grid container spacing={3} justifyContent='center' sx={{ width: '100%', maxWidth: '65%' }}>
          {posts.map((post) => (
            <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
              <PostView {...{ post }} />
            </Grid>
          ))}
          <div ref={loadMoreRef} style={{ height: 40, width: '100%' }} />
        </Grid>
      </Stack>

      <GenericDialog isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title='Edit Profile'>
        <EditProfileForm
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditProfile}
          defaultValues={{
            username: user?.username,
            image: user?.profilePictureURL ? `${envVar.VITE_BACKEND_URL}${user.profilePictureURL}` : undefined,
          }}
        />
      </GenericDialog>
    </Container>
  );
};

export default ProfilePage;
