import { useCloseDirtyFormDialog } from '@/hooks';
import type { Post } from '@entities';
import type { FC } from 'react';
import { PostForm, type PostFormProps } from '.';
import { GenericDialog, type GenericDialogProps } from '..';

export type EditPostDialogProps = Pick<GenericDialogProps, 'isOpen' | 'onClose'> & { post: Post };

export const EditPostDialog: FC<EditPostDialogProps> = ({ post, isOpen, onClose }) => {
  const { handleCloseDialog, handleCloseOnSubmit, isDirtyFormRef } = useCloseDirtyFormDialog({ onClose });

  const handleEdit: PostFormProps['onSubmit'] = (values) => {
    console.log('EDIT', post.id, values);

    handleCloseOnSubmit();
  };

  return (
    <GenericDialog {...{ isOpen, onClose: handleCloseDialog, title: 'Edit Post' }}>
      <PostForm {...{ defaultValues: post, onSubmit: handleEdit, submitLabel: 'Save changes', isDirtyFormRef }} />
    </GenericDialog>
  );
};
