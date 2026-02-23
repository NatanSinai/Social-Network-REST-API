import { DeletePostDialog, EditPostDialog } from '@components';
import {
  useDeletePostDialog,
  useEditPostDialog,
  type UseDeletePostDialogContent,
  type UseEditPostDialogContent,
} from '@hooks';
import { createContext, useContext, type FC, type PropsWithChildren } from 'react';

export type PostActionsContextContent = Pick<
  UseEditPostDialogContent,
  'openEditPostDialog' | 'isEditPostDialogOpen' | 'closeEditPostDialog'
> &
  Pick<UseDeletePostDialogContent, 'openDeletePostDialog' | 'isDeletePostDialogOpen' | 'closeDeletePostDialog'>;

const PostActionsContext = createContext<PostActionsContextContent | undefined>(undefined);

export const PostActionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isEditPostDialogOpen, openEditPostDialog, closeEditPostDialog, postToEdit } = useEditPostDialog();
  const { isDeletePostDialogOpen, openDeletePostDialog, closeDeletePostDialog, postToDelete } = useDeletePostDialog();

  return (
    <PostActionsContext.Provider
      value={{
        isEditPostDialogOpen,
        openEditPostDialog,
        closeEditPostDialog,
        isDeletePostDialogOpen,
        openDeletePostDialog,
        closeDeletePostDialog,
      }}
    >
      {children}

      <EditPostDialog {...{ isOpen: isEditPostDialogOpen, onClose: closeEditPostDialog, post: postToEdit }} />

      <DeletePostDialog {...{ isOpen: isDeletePostDialogOpen, onClose: closeDeletePostDialog, post: postToDelete }} />
    </PostActionsContext.Provider>
  );
};

export const usePostActionsContext = () => {
  const context = useContext(PostActionsContext);

  if (!context) throw new Error('usePostActionsContext must be used within an PostActionsProvider');

  return context;
};
