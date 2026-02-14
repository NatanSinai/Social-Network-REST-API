import { useEffect, useMemo } from 'react';
import type { FileOrURL } from '../ImageUpload';

export type UseImagePreviewArgs = { value: FileOrURL };

export type UseImagePreviewContent = ReturnType<typeof useImagePreview>;

export const useImagePreview = ({ value }: UseImagePreviewArgs) => {
  const previewUrl = useMemo(() => {
    if (value instanceof File) return URL.createObjectURL(value);

    if (typeof value === 'string') return value;

    return null;
  }, [value]);

  useEffect(() => {
    if (!(value instanceof File) || !previewUrl) return;

    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl, value]);

  return { previewUrl };
};
