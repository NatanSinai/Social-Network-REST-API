import type { Post } from '@entities';
import { useState } from 'react';
import { useBoolean } from 'usehooks-ts';

export type UseEditPostDialogArgs = {};

export type UseEditPostDialogContent = ReturnType<typeof useEditPostDialog>;

export const useEditPostDialog = () => {
  const { value: isEditPostDialogOpen, setTrue, setFalse: closeEditPostDialog } = useBoolean();
  const [postToEdit, setPostToEdit] = useState<Post | undefined>(undefined);

  const openEditPostDialog = (post: Post) => {
    setPostToEdit(post);

    setTrue();
  };

  return { isEditPostDialogOpen, openEditPostDialog, closeEditPostDialog, postToEdit };
};
