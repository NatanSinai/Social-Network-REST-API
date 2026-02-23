import { useRef } from 'react';

export type UseCloseDirtyFormDialogArgs = { onClose: VoidFunction };

export type UseCloseDirtyFormDialogContent = ReturnType<typeof useCloseDirtyFormDialog>;

export const useCloseDirtyFormDialog = ({ onClose }: UseCloseDirtyFormDialogArgs) => {
  const isDirtyFormRef = useRef(false);

  const handleCloseWithDirtyFormValidation =
    ({ isCheckDirtyForm = false }: { isCheckDirtyForm?: boolean } = {}) =>
    () => {
      if (isCheckDirtyForm && isDirtyFormRef.current) {
        // TODO: Alert on unsaved inputs and don't immediately close
        onClose();

        return;
      }

      onClose();
    };

  const handleCloseOnSubmit = handleCloseWithDirtyFormValidation();

  const handleCloseDialog = handleCloseWithDirtyFormValidation({ isCheckDirtyForm: true });

  return { isDirtyFormRef, handleCloseDialog, handleCloseOnSubmit };
};
