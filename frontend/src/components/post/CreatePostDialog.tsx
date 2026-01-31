import type { FC } from 'react';
import { PostForm, type PostFormProps } from '.';
import { GenericDialog, type GenericDialogProps } from '..';

export type CreatePostDialogProps = Pick<GenericDialogProps, 'isOpen' | 'onClose'>;

export const CreatePostDialog: FC<CreatePostDialogProps> = ({ isOpen, onClose }) => {
  const handleCreate: PostFormProps['onSubmit'] = (values) => {
    console.log('CREATE', values);

    onClose();
  };

  return (
    <GenericDialog {...{ isOpen, onClose, title: 'Create Post' }}>
      <PostForm onSubmit={handleCreate} submitLabel='Create' />
    </GenericDialog>
  );
};
