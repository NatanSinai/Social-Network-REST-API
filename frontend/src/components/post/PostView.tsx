import type { Post } from '@entities';
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

export type PostViewProps = { post: Post };

export const PostView: FC<PostViewProps> = ({
  post: {
    imageURL,
    title,
    content,
    author: { username: authorName, profilePictureURL: authorProfilePictureURL },
    commentsAmount,
  },
}) => {
  const [liked, setLiked] = useState(false);

  return (
    <Card sx={{ borderRadius: 4, height: '100%', width: '100%' }} elevation={10}>
      <CardMedia component='img' height='180px' image={imageURL} alt={title} sx={{ objectFit: 'cover' }} />

      <CardContent component={Stack} spacing={1} bgcolor='secondary.main'>
        <Stack>
          <Typography variant='h6' component='div'>
            {title}
          </Typography>

          <Typography variant='body2' maxHeight='10em' overflow='auto'>
            {content}
          </Typography>
        </Stack>

        <Stack direction='row' spacing={1} alignItems='center'>
          <Avatar src={authorProfilePictureURL} alt={authorName} />

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
          <IconButton>
            <ChatBubbleOutline />
          </IconButton>
        </Badge>
      </CardActions>
    </Card>
  );
};
