import type { Post } from '@entities';
import { envVar } from '@env';
import { ChatBubbleOutline, Favorite, FavoriteBorder } from '@mui/icons-material';
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
import { useState, type FC } from 'react';
import { useBoolean } from 'usehooks-ts';
import { CommentsDialog } from './CommentsDialog';

export type PostViewProps = { post: Post };

export const PostView: FC<PostViewProps> = ({
  post: {
    imageURL,
    title,
    content,
    author: { username: authorName, profilePictureURL: authorProfilePictureURL },
    commentsAmount,
    id: postId,
  },
}) => {
  const [liked, setLiked] = useState(false);
  const { value: isCommentsOpen, setTrue: openComments, setFalse: closeComments } = useBoolean();

  const fullImageURL = imageURL ? `${envVar.VITE_BACKEND_URL}${imageURL}` : undefined;
  const fullAuthorAvatarURL = authorProfilePictureURL ? `${envVar.VITE_BACKEND_URL}${authorProfilePictureURL}` : undefined;

  return (
    <Card sx={{ borderRadius: 4, width: '100%' }} elevation={10}>
      <CardMedia component='img' height='180px' image={fullImageURL} alt={title} sx={{ objectFit: 'cover' }} />

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
