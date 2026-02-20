import { getPosts } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import { useInfiniteScroll } from '@/hooks';
import { PostView } from '@components';
import { Grid, Stack } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { CreatePostButton, NoPostsMessage } from './components';

export type PostsFeedPageProps = {};

export const PostsFeedPage: FC<PostsFeedPageProps> = () => {

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: queryKeys.posts.all(),
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => getPosts(pageParam, 10),
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined),
  });

  const loadMoreRef = useInfiniteScroll({ callback: fetchNextPage, isEnabled: hasNextPage && !isFetchingNextPage });

  const posts = data?.pages.flatMap(({ posts }) => posts);

  // TODO: Add skeletons on loading

  return (
    <Stack justifyContent='center' alignItems='center' height='100%'>
      {!posts?.length ? (
        <NoPostsMessage />
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
                <PostView {...{ post }} />
              </Grid>
            ))}

            <div ref={loadMoreRef} style={{ height: 40 }} />
          </Grid>
        </Stack>
      )}
    </Stack>
  );
};
