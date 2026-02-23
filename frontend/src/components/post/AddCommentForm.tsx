import { Button, Stack, TextField } from '@mui/material';
import { useState, type FC, type FormEvent } from 'react';

export type AddCommentFormProps = {
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
};

export const AddCommentForm: FC<AddCommentFormProps> = ({ onSubmit, isLoading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit(content);
    setContent('');
  };

  return (
    <Stack component='form' onSubmit={handleSubmit} direction='row' spacing={1} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        size='small'
        placeholder='Write a comment...'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      <Button type='submit' variant='contained' disabled={!content.trim() || isLoading}>
        Post
      </Button>
    </Stack>
  );
};
