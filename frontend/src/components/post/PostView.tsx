import { useAuthContext } from '@/providers/AuthProvider';
import type { Post } from '@entities';
import { createFullImageURL } from '@helpers';
import { ChatBubbleOutline, Edit, Favorite, FavoriteBorder } from '@mui/icons-material';
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
import { useRef, useState, type FC, type RefObject } from 'react';
import { useBoolean, useHover } from 'usehooks-ts';
import { CommentsDialog } from './CommentsDialog';

export type PostViewProps = { post: Post; openEditPostDialog: (post: Post) => void };

export const PostView: FC<PostViewProps> = ({ post, openEditPostDialog }) => {
  const [liked, setLiked] = useState(false);
  const { value: isCommentsOpen, setTrue: openComments, setFalse: closeComments } = useBoolean();

  const { userId } = useAuthContext();

  const postCardElementRef = useRef<HTMLDivElement>(null);
  const isHovering = useHover(postCardElementRef as RefObject<HTMLDivElement>);

  const {
    imageURL,
    title,
    content,
    author: { id: authorId, username: authorName, profilePictureURL: authorProfilePictureURL },
    commentsAmount,
    id: postId,
  } = post;

  const isUserAuthor = userId === authorId;

  const fullImageURL = createFullImageURL(imageURL);
  const fullAuthorAvatarURL = createFullImageURL(authorProfilePictureURL) ?? undefined;

  return (
    <Card sx={{ borderRadius: 4, width: '100%' }} elevation={10} ref={postCardElementRef}>
      <CardMedia component='img' height='180px' image={fullImageURL ?? title} alt={title} sx={{ objectFit: 'cover' }} />

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
        <IconButton onClick={() => setLiked(!liked)} color={liked ? 'error' : 'default'}>
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>

        {isUserAuthor && (
          <IconButton
            onClick={() => openEditPostDialog(post)}
            style={{ opacity: isHovering ? 1 : 0, transition: 'opacity 0.2s ease-in-out' }}
          >
            <Edit />
          </IconButton>
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
