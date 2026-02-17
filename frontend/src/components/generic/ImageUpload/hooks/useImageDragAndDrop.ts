import { isImageFile } from '@helpers';
import { type DragEvent } from 'react';
import { useBoolean } from 'usehooks-ts';

export type UseImageDragAndDropArgs = { onImageDrop: (file: File) => void };

export type UseImageDragAndDropContent = ReturnType<typeof useImageDragAndDrop>;

export const useImageDragAndDrop = ({ onImageDrop }: UseImageDragAndDropArgs) => {
  const { value: isDragging, setTrue: setIsDragging, setFalse: setIsNotDragging } = useBoolean();

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging();
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsNotDragging();
  };

  const handleDragOver = (event: DragEvent) => event.preventDefault();

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setIsNotDragging();

    const droppedFile = event.dataTransfer.files[0];

    if (droppedFile && isImageFile(droppedFile)) onImageDrop(droppedFile);
  };

  return { isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop };
};
