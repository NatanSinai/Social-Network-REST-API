import { createPost } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import { useCloseDirtyFormDialog } from '@/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { PostForm, type PostFormProps } from '.';
import { GenericDialog, type GenericDialogProps } from '..';

export type CreatePostDialogProps = Pick<GenericDialogProps, 'isOpen' | 'onClose'>;

export const CreatePostDialog: FC<CreatePostDialogProps> = ({ isOpen, onClose }) => {
  const { handleCloseDialog, handleCloseOnSubmit, isDirtyFormRef } = useCloseDirtyFormDialog({ onClose });

  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() }),
    onError: (error) => {
      // TODO: Raise error

      console.log(error);
    },
  });

  const handleCreate: PostFormProps['onSubmit'] = async (postForm) => {
    await createPostMutation.mutateAsync(postForm, { onSuccess: handleCloseOnSubmit });
  };

  return (
    <GenericDialog {...{ isOpen, onClose: handleCloseDialog, title: 'Create Post' }}>
      <PostForm {...{ onSubmit: handleCreate, submitLabel: 'Create', isDirtyFormRef }} />
    </GenericDialog>
  );
};
