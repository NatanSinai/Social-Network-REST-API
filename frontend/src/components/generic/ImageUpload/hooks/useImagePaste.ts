import { isImageFile } from '@helpers';
import { useRef } from 'react';
import { useEventListener } from 'usehooks-ts';

export type UseImagePasteArgs = { onImagePaste: (file: File) => void };

export type UseImagePasteContent = ReturnType<typeof useImagePaste>;

export const useImagePaste = ({ onImagePaste }: UseImagePasteArgs) => {
  const handlePaste = (event: ClipboardEvent) => {
    const pastedImage = [...(event.clipboardData?.files ?? [])].find(isImageFile);

    if (pastedImage) onImagePaste(pastedImage);
  };

  useEventListener('paste', handlePaste, useRef(document));
};
