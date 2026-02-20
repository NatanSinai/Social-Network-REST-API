import { Delete, Upload } from '@mui/icons-material';
import { Box, FormHelperText, IconButton, Stack, Typography, type IconButtonProps } from '@mui/material';
import { useRef, type FC } from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useImageDragAndDrop, useImagePaste, useImagePreview } from './hooks';

export type FileOrURL = File | string | null;

export type ImageUploadProps = ControllerRenderProps<{ image: FileOrURL | undefined }, 'image'> & {
  size?: number;
  error: string | undefined;
};

export const ImageUpload: FC<ImageUploadProps> = ({
  value = null,
  onChange,
  size = 200,
  name,
  onBlur,
  disabled,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (updatedImage: typeof value) => {
    if (!updatedImage && !!value) return;

    onChange(updatedImage);
  };

  const { previewUrl } = useImagePreview({ value });

  const { isDragging, handleDragOver, handleDragLeave, handleDrop, handleDragEnter } = useImageDragAndDrop({
    onImageDrop: handleFileChange,
  });

  useImagePaste({ onImagePaste: handleFileChange, disabled });

  const handleDeleteFile: IconButtonProps['onClick'] = (event) => {
    event.stopPropagation();

    onChange(null);
  };

  return (
    <Stack spacing={2} alignItems='flex-start' position='relative'>
      <Stack
        onClick={() => (!disabled ? fileInputRef.current?.click() : undefined)}
        onDragEnter={!disabled ? handleDragEnter : undefined}
        onDragLeave={!disabled ? handleDragLeave : undefined}
        onDragOver={!disabled ? handleDragOver : undefined}
        onDrop={!disabled ? handleDrop : undefined}
        sx={{
          width: size,
          height: size,
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: error ? 'error.main' : isDragging ? 'primary.main' : 'divider',
          cursor: !disabled ? 'pointer' : 'initial',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isDragging ? 'action.hover' : 'transparent',
          transition: 'all 0.2s ease',
        }}
      >
        {previewUrl ? (
          <Box
            component='img'
            src={previewUrl}
            alt='Preview'
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Stack justifyContent='center' alignItems='center' spacing={1}>
            <Upload color='disabled' fontSize='large' sx={{ pointerEvents: 'none' }} />

            <Typography sx={{ opacity: 0.6 }}>Upload Image</Typography>
          </Stack>
        )}

        {isDragging && (
          <Stack
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0, 0, 0, 0.35)',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography color='white' variant='subtitle1'>
              Drop image here
            </Typography>
          </Stack>
        )}

        {previewUrl && !disabled && (
          <Stack
            direction='row'
            spacing={2}
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0, 0, 0, 0.45)',
              opacity: 0,
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 1 },
            }}
          >
            <IconButton sx={{ color: 'white', opacity: 0.5 }}>
              <Upload />
            </IconButton>

            <IconButton sx={{ color: 'white', opacity: 0.5 }} onClick={handleDeleteFile}>
              <Delete />
            </IconButton>
          </Stack>
        )}

        <input
          {...{ name, onBlur, disabled }}
          ref={fileInputRef}
          hidden
          type='file'
          accept='image/*'
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
      </Stack>

      {!!error && <FormHelperText error>{error}</FormHelperText>}
    </Stack>
  );
};
