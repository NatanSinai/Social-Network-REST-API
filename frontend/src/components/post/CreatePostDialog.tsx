import { useCloseDirtyFormDialog } from '@/hooks';
import { type FC } from 'react';
import { PostForm, type PostFormProps } from '.';
import { GenericDialog, type GenericDialogProps } from '..';

export type CreatePostDialogProps = Pick<GenericDialogProps, 'isOpen' | 'onClose'>;

export const CreatePostDialog: FC<CreatePostDialogProps> = ({ isOpen, onClose }) => {
  const { handleCloseDialog, handleCloseOnSubmit, isDirtyFormRef } = useCloseDirtyFormDialog({ onClose });

  const handleCreate: PostFormProps['onSubmit'] = (values) => {
    console.log('CREATE', values);

    handleCloseOnSubmit();
  };

  return (
    <GenericDialog {...{ isOpen, onClose: handleCloseDialog, title: 'Create Post' }}>
      <PostForm {...{ onSubmit: handleCreate, submitLabel: 'Create', isDirtyFormRef }} />
    </GenericDialog>
  );
};
