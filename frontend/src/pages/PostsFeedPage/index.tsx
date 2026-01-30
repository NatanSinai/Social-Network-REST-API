import { PostView } from '@components';
import { Grid, Stack } from '@mui/material';
import { omit } from 'lodash';
import type { FC } from 'react';
import { NoPostsMessage } from './components';

export type Post = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  commentsAmount: number;
  imageURL: string;
  author: {
    id: string;
    name: string;
    profilePictureURL: string;
  };
};

const POST_EXAMPLE_DATA: Post = {
  id: '8669eec1-23b3-5a5e-8339-9f29df3564ec',
  title: 'Hello World',
  content:
    'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorem nemo eum hic eligendi, quod expedita placeat porro voluptate unde. Quos quo iusto numquam tenetur iste reprehenderit possimus id nemo quaerat!',
  updatedAt: '2026-01-02',
  createdAt: '2026-01-01',
  commentsAmount: 3,
  imageURL: 'https://i.pravatar.cc/450?img=2',
  author: {
    id: '85a38fe2-38d4-57c4-b452-e3a23c6c9602',
    name: 'Natan Sinai',
    profilePictureURL: 'https://i.pravatar.cc/450?img=3',
  },
};

const EXAMPLE_POSTS_DATA = Array.from(Array(10), () => ({
  ...omit(POST_EXAMPLE_DATA, 'id'),
  id: Math.random().toString(),
}));

export type PostsFeedPageProps = {};

export const PostsFeedPage: FC<PostsFeedPageProps> = () => {
  const posts = EXAMPLE_POSTS_DATA;

  return (
    <Stack justifyContent='center' alignItems='center' height='100%'>
      {!posts.length ? (
        <NoPostsMessage />
      ) : (
        <Grid
          container
          spacing={3}
          overflow='auto'
          justifyContent='center'
          sx={{ width: '90%', maxHeight: '80%', maxWidth: '65%', '::-webkit-scrollbar': { width: 0 } }}
        >
          {posts.map((post) => (
            <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
              <PostView {...{ post }} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};
