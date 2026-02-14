import { getPosts } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import { useInfiniteScroll } from '@/hooks';
import { PostView } from '@components';
import { Grid, Stack } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { CreatePostButton, NoPostsMessage } from './components';

// const POST_EXAMPLE_DATA: Post = {
//   id: '8669eec1-23b3-5a5e-8339-9f29df3564ec',
//   title: 'Hello World',
//   content:
//     'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem nemo eum hic eligendi, quod expedita placeat porro voluptate unde. Quos quo iusto numquam tenetur iste reprehenderit possimus id nemo quaerat!',
//   updatedAt: new Date('2026-01-02'),
//   createdAt: new Date('2026-01-01'),
//   commentsAmount: 3,
//   imageURL: 'https://i.pravatar.cc/450?img=2',
//   author: {
//     id: '85a38fe2-38d4-57c4-b452-e3a23c6c9602',
//     username: 'Natan Sinai',
//     profilePictureURL: 'https://i.pravatar.cc/450?img=3',
//   },
// };

// const EXAMPLE_POSTS_DATA = Array.from(Array(5), () => ({
//   ...omit(POST_EXAMPLE_DATA, 'id'),
//   id: Math.random().toString(),
// }));

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
            sx={{ width: '90%', maxHeight: '80%', maxWidth: '65%', py: 3, '::-webkit-scrollbar': { width: 0 } }}
          >
            {posts.map((post) => (
              <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
                <PostView {...{ post }} />
              </Grid>
            ))}
          </Grid>

          <div ref={loadMoreRef} style={{ height: 40 }} />
        </Stack>
      )}
    </Stack>
  );
};
