import { CreatePostDialog } from '@components';
import { Button } from '@mui/material';
import { type FC } from 'react';
import { useBoolean } from 'usehooks-ts';

export type CreatePostButtonProps = {};

export const CreatePostButton: FC<CreatePostButtonProps> = () => {
  const { value: isOpen, setTrue: openCreatePostDialog, setFalse: closeCreatePostDialog } = useBoolean();

  return (
    <>
      <Button variant='contained' onClick={openCreatePostDialog}>
        Create Post
      </Button>

      <CreatePostDialog isOpen={isOpen} onClose={closeCreatePostDialog} />
    </>
  );
};
