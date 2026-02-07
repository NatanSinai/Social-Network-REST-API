import type { Comment } from '@/api/comment';
import { envVar } from '@env';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { type FC } from 'react';

export type CommentItemProps = {
  comment: Comment;
};

export const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const avatarUrl = comment.author?.profilePictureURL
    ? `${envVar.VITE_BACKEND_URL}${comment.author.profilePictureURL}`
    : undefined;

  return (
    <Stack direction='row' spacing={2} sx={{ mb: 2, alignItems: 'flex-start' }}>
      <Avatar src={avatarUrl} alt={comment.author?.username} sx={{ width: 32, height: 32 }} />
      <Box sx={{ bgcolor: 'grey.100', p: 1.5, borderRadius: 2, flexGrow: 1 }}>
        <Typography color='primary.main' variant='subtitle2' fontWeight={700}>
          {comment.author?.username}
        </Typography>
        <Typography variant='body2' color='text.secondary'>{comment.content}</Typography>
        <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
          {new Date(comment.createdAt).toLocaleString()}
        </Typography>
      </Box>
    </Stack>
  );
};
