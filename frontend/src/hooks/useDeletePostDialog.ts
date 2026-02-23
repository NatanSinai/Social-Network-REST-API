import type { Post } from '@entities';
import { useState } from 'react';
import { useBoolean } from 'usehooks-ts';

export type UseDeletePostDialogArgs = {};

export type UseDeletePostDialogContent = ReturnType<typeof useDeletePostDialog>;

export const useDeletePostDialog = () => {
  const { value: isDeletePostDialogOpen, setTrue, setFalse: closeDeletePostDialog } = useBoolean();
  const [postToDelete, setPostToDelete] = useState<Post | undefined>(undefined);

  const openDeletePostDialog = (post: Post) => {
    setPostToDelete(post);

    setTrue();
  };

  return { isDeletePostDialogOpen, openDeletePostDialog, closeDeletePostDialog, postToDelete };
};
