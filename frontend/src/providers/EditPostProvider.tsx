import { EditPostDialog } from '@components';
import { useEditPostDialog, type UseEditPostDialogContent } from '@hooks';
import { createContext, useContext, type FC, type PropsWithChildren } from 'react';

export type EditPostContextType = Pick<
  UseEditPostDialogContent,
  'openEditPostDialog' | 'isEditPostDialogOpen' | 'closeEditPostDialog'
>;

const EditPostContext = createContext<EditPostContextType | undefined>(undefined);

export const EditPostProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isEditPostDialogOpen, openEditPostDialog, closeEditPostDialog, postToEdit } = useEditPostDialog();

  return (
    <EditPostContext.Provider value={{ isEditPostDialogOpen, openEditPostDialog, closeEditPostDialog }}>
      {children}

      <EditPostDialog {...{ isOpen: isEditPostDialogOpen, onClose: closeEditPostDialog, post: postToEdit }} />
    </EditPostContext.Provider>
  );
};

export const useEditPostContext = () => {
  const context = useContext(EditPostContext);

  if (!context) throw new Error('useEditPostContext must be used within an EditPostProvider');

  return context;
};
