import type { Comment } from '@/api/comment';
import { useAuthContext } from '@/providers/AuthProvider';
import { envVar } from '@env';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { type FC } from 'react';

export type CommentItemProps = {
  comment: Comment;
};

export const CommentItem: FC<CommentItemProps> = ({ comment }) => {
  const { userId } = useAuthContext();
  const isOwnComment = comment.author?.id === userId;

  const avatarUrl = comment.author?.profilePictureURL
    ? `${envVar.VITE_BACKEND_URL}${comment.author.profilePictureURL}`
    : undefined;

  return (
    <Stack
      direction={isOwnComment ? 'row-reverse' : 'row'}
      spacing={1}
      sx={{
        mb: 2,
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      <Avatar src={avatarUrl} alt={comment.author?.username} sx={{ width: 32, height: 32, mt: 0.5 }} />
      <Box
        sx={{
          bgcolor: isOwnComment ? 'primary.light' : 'grey.100',
          color: isOwnComment ? 'primary.contrastText' : 'text.primary',
          p: 1.5,
          borderRadius: 2,
          maxWidth: '80%',
          position: 'relative',
          ...(isOwnComment
            ? {
                borderTopRightRadius: 0,
                ml: 'auto',
              }
            : {
                borderTopLeftRadius: 0,
              }),
        }}
      >
        {!isOwnComment && (
          <Typography color='primary.main' variant='subtitle2' fontWeight={700} sx={{ mb: 0.5 }}>
            {comment.author?.username}
          </Typography>
        )}
        <Typography
          variant='body2'
          sx={{
            color: isOwnComment ? 'inherit' : 'text.primary',
            wordBreak: 'break-word',
          }}
        >
          {comment.content}
        </Typography>
        <Typography
          variant='caption'
          sx={{
            mt: 0.5,
            display: 'block',
            textAlign: isOwnComment ? 'right' : 'left',
            color: isOwnComment ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
          }}
        >
          {new Date(comment.createdAt).toLocaleString()}
        </Typography>
      </Box>
    </Stack>
  );
};
