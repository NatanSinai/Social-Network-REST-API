import type { Post } from '@entities';
import type { FC } from 'react';
import { PostForm, type PostFormProps } from '.';
import { GenericDialog, type GenericDialogProps } from '..';

export type EditPostDialogProps = Pick<GenericDialogProps, 'isOpen' | 'onClose'> & { post: Post };

export const EditPostDialog: FC<EditPostDialogProps> = ({ post, isOpen, onClose }) => {
  const handleEdit: PostFormProps['onSubmit'] = (values) => {
    console.log('EDIT', post.id, values);

    onClose();
  };

  return (
    <GenericDialog {...{ isOpen, onClose, title: 'Edit Post' }}>
      <PostForm defaultValues={post} onSubmit={handleEdit} submitLabel='Save changes' />
    </GenericDialog>
  );
};
