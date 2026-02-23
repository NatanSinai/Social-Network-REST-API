import { toggleLikePost } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import { useAuthContext } from '@/providers/AuthProvider';
import { usePostActionsContext } from '@/providers/PostActionsProvider';
import type { Post } from '@entities';
import { createFullImageURL } from '@helpers';
import { ChatBubbleOutline, DeleteOutline, EditOutlined, Favorite, FavoriteBorder } from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, type FC, type RefObject } from 'react';
import { useBoolean, useHover } from 'usehooks-ts';
import { CommentsDialog } from './CommentsDialog';

export type PostViewProps = { post: Post };

export const PostView: FC<PostViewProps> = ({ post }) => {
  const { userId } = useAuthContext();
  const { openEditPostDialog, openDeletePostDialog } = usePostActionsContext();
  const queryClient = useQueryClient();

  const { value: isCommentsOpen, setTrue: openComments, setFalse: closeComments } = useBoolean();

  const postCardElementRef = useRef<HTMLDivElement>(null);
  const isHovering = useHover(postCardElementRef as RefObject<HTMLDivElement>);

  const {
    imageURL,
    title,
    content,
    author: { id: authorId, username: authorName, profilePictureURL: authorProfilePictureURL },
    commentsAmount,
    likesAmount,
    isLiked,
    id: postId,
  } = post;

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => toggleLikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() });
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.posts.sender(userId) });
      }
    },
  });

  const isUserAuthor = userId === authorId;

  const fullImageURL = createFullImageURL(imageURL);
  const fullAuthorAvatarURL = createFullImageURL(authorProfilePictureURL) ?? undefined;

  const handleLikeClick = () => {
    toggleLike();
  };

  return (
    <Card sx={{ borderRadius: 4, width: '100%' }} elevation={10} ref={postCardElementRef}>
      {!!fullImageURL && (
        <CardMedia component='img' height='180px' image={fullImageURL} alt={title} sx={{ objectFit: 'cover' }} />
      )}

      <CardContent component={Stack} spacing={1} bgcolor='secondary.main'>
        <Stack>
          <Typography variant='h5' component='div'>
            {title}
          </Typography>

          <Typography variant='body2' maxHeight='10em' overflow='auto'>
            {content}
          </Typography>
        </Stack>

        <Stack direction='row' spacing={1} alignItems='center'>
          <Avatar src={fullAuthorAvatarURL} alt={authorName} />

          <Typography variant='body2' color='text.primary'>
            {authorName}
          </Typography>
        </Stack>
      </CardContent>

      <Divider />

      <CardActions sx={{ bgcolor: 'secondary.main', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
        <Badge badgeContent={likesAmount} overlap='circular' color='error'>
          <IconButton onClick={handleLikeClick} color={isLiked ? 'error' : 'default'}>
            {isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Badge>

        {isUserAuthor && (
          <Stack
            direction='row'
            spacing={1}
            style={{ opacity: isHovering ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
          >
            <IconButton onClick={() => openEditPostDialog(post)}>
              <EditOutlined />
            </IconButton>

            <IconButton onClick={() => openDeletePostDialog(post)}>
              <DeleteOutline />
            </IconButton>
          </Stack>
        )}

        <Badge badgeContent={commentsAmount} overlap='circular' color='primary'>
          <IconButton onClick={openComments}>
            <ChatBubbleOutline />
          </IconButton>
        </Badge>
      </CardActions>

      <CommentsDialog postId={postId} isOpen={isCommentsOpen} onClose={closeComments} />
    </Card>
  );
};
