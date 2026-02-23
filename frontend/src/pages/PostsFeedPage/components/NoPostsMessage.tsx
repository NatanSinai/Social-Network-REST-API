import { Stack, Typography } from '@mui/material';
import type { FC } from 'react';
import { CreatePostButton } from '.';

const NO_POSTS_YET = 'There are currently no posts, be the first to create one!';

export type NoPostsMessageProps = {};

export const NoPostsMessage: FC<NoPostsMessageProps> = () => {
  return (
    <Stack spacing={3} alignItems='center'>
      <Typography variant='h6'>{NO_POSTS_YET}</Typography>

      <CreatePostButton />
    </Stack>
  );
};
