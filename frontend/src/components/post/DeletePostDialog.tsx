import { deletePost } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import type { Post } from '@entities';
import { useCloseDirtyFormDialog } from '@hooks';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { GenericDialog, type GenericDialogProps } from '..';

export type DeletePostDialogProps = Pick<GenericDialogProps, 'isOpen' | 'onClose'> & { post: Post | undefined };

export const DeletePostDialog: FC<DeletePostDialogProps> = ({ post, isOpen, onClose }) => {
  const { handleCloseDialog, handleCloseOnSubmit } = useCloseDirtyFormDialog({ onClose });

  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() }),
    onError: (error) => {
      // TODO: Raise error

      console.log(error);
    },
  });

  if (!post) return null;

  const handleDelete = () =>
    deletePostMutation.mutateAsync(
      { id: post.id },
      {
        onSuccess: () => {
          handleCloseOnSubmit();

          deletePostMutation.reset();
        },
      },
    );

  const isLoading = deletePostMutation.isPending || deletePostMutation.isSuccess;

  return (
    <GenericDialog {...{ isOpen, onClose: handleCloseDialog, isLoading, title: 'Delete Post' }}>
      <Stack spacing={2}>
        <Typography>
          Are you sure you want to delete the post "<b>{post.title}</b>"
        </Typography>

        {deletePostMutation.isError && <Alert severity='error'>An error happened, please try again</Alert>}

        <Stack direction='row' spacing={1}>
          <Button onClick={handleDelete} disabled={isLoading}>
            Delete
          </Button>

          <Button onClick={handleCloseDialog} variant='outlined' disabled={isLoading}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </GenericDialog>
  );
};
