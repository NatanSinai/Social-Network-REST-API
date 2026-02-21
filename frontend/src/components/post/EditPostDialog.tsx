import { editPost } from '@/api/post';
import { queryKeys } from '@/api/queryKeys';
import type { Post } from '@entities';
import { useCloseDirtyFormDialog } from '@hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { FC } from 'react';
import { PostForm, type PostFormProps } from '.';
import { GenericDialog, type GenericDialogProps } from '..';

export type EditPostDialogProps = Pick<GenericDialogProps, 'isOpen' | 'onClose'> & { post: Post | undefined };

export const EditPostDialog: FC<EditPostDialogProps> = ({ post, isOpen, onClose }) => {
  const { handleCloseDialog, handleCloseOnSubmit, isDirtyFormRef } = useCloseDirtyFormDialog({ onClose });

  const queryClient = useQueryClient();

  const editPostMutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.posts.all() }),
    onError: (error) => {
      // TODO: Raise error

      console.log(error);
    },
  });

  if (!post) return null;

  const handleEdit: PostFormProps['onSubmit'] = (postForm) =>
    editPostMutation.mutateAsync({ ...postForm, id: post.id }, { onSuccess: handleCloseOnSubmit });

  const defaultValues = { ...post, image: post.imageURL } satisfies PostFormProps['defaultValues'];

  return (
    <GenericDialog {...{ isOpen, onClose: handleCloseDialog, title: 'Edit Post' }}>
      <PostForm {...{ defaultValues, onSubmit: handleEdit, submitLabel: 'Save changes', isDirtyFormRef }} />
    </GenericDialog>
  );
};
