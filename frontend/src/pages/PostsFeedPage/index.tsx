import { getPosts } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import { useInfiniteScroll } from '@/hooks';
import { useEditPostContext } from '@/providers/EditPostProvider';
import { PostView } from '@components';
import { Grid, Stack, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { CreatePostButton, NoPostsMessage } from './components';

const POSTS_ERROR_MESSAGE = 'We have some trouble getting the posts, please refresh the screen';

export type PostsFeedPageProps = {};

export const PostsFeedPage: FC<PostsFeedPageProps> = () => {
  const { openEditPostDialog } = useEditPostContext();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError } = useInfiniteQuery({
    queryKey: queryKeys.posts.all(),
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, 10),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined),
  });

  const loadMoreRef = useInfiniteScroll({ callback: fetchNextPage, isEnabled: hasNextPage && !isFetchingNextPage });

  const posts = data?.pages.flatMap(({ posts }) => posts);

  // TODO: Add skeletons on loading

  // TODO: Don't fetch when going to a different screen

  return (
    <Stack justifyContent='center' alignItems='center' height='100%'>
      {!posts?.length ? (
        isError ? (
          <Typography variant='h5' textAlign='center'>
            {POSTS_ERROR_MESSAGE}
          </Typography>
        ) : (
          <NoPostsMessage />
        )
      ) : (
        <Stack justifyContent='center' alignItems='center' height='100%' width='100%' spacing={2}>
          <CreatePostButton />

          <Grid
            container
            spacing={3}
            overflow='auto'
            justifyContent='center'
            sx={{ width: '90%', maxHeight: '80%', maxWidth: '65%', py: 3, px: 2, '::-webkit-scrollbar': { width: 0 } }}
          >
            {posts.map((post) => (
              <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
                <PostView {...{ post, openEditPostDialog }} />
              </Grid>
            ))}

            <div ref={loadMoreRef} style={{ height: 40 }} />
          </Grid>
        </Stack>
      )}
    </Stack>
  );
};
